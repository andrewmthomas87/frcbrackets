import type {
  DivisionPrediction,
  DivisionPredictionAlliance,
  Team,
  TeamStats,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = getClient();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
  }
  prisma = global.__db__;
}

function getClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const databaseUrl = new URL(DATABASE_URL);

  const isLocalHost = databaseUrl.hostname === "localhost";

  const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION;
  const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION;

  const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;

  if (!isLocalHost) {
    databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`;
    if (!isReadReplicaRegion) {
      // 5433 is the read-replica port
      databaseUrl.port = "5433";
    }
  }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });
  // connect eagerly
  client.$connect();

  return client;
}

export type TeamAndStats = Team & {
  stats: TeamStats;
};

export async function teamsAndStatsByDivision(
  divisionKey: string
): Promise<TeamAndStats[]> {
  return (
    await prisma.team.findMany({
      where: {
        division: {
          key: divisionKey,
        },
      },
      include: {
        stats: true,
      },
    })
  ).filter((team): team is TeamAndStats => !!team.stats);
}

export type SimpleTeamAndStats = {
  key: string;
  name: string;
  stats: {
    winningMarginElo: number;
    unpenalizedTotalPoints: number;
  };
  teamNumber: number;
};

export async function simpleTeamsAndStatsByDivision(
  divisionKey: string
): Promise<SimpleTeamAndStats[]> {
  return (
    await prisma.team.findMany({
      where: {
        division: {
          key: divisionKey,
        },
      },
      select: {
        key: true,
        teamNumber: true,
        name: true,
        stats: {
          select: {
            winningMarginElo: true,
            unpenalizedTotalPoints: true,
          },
        },
      },
    })
  ).filter((team): team is SimpleTeamAndStats => !!team.stats);
}

export type TeamKeyOnly = {
  key: string;
};

export async function teamKeysOnlyByDivision(
  divisionKey: string
): Promise<TeamKeyOnly[]> {
  return await prisma.team.findMany({
    where: {
      division: {
        key: divisionKey,
      },
    },
    select: {
      key: true,
    },
  });
}

export type DivisionPredictionAndAlliances =
  | DivisionPrediction & {
      alliances: (DivisionPredictionAlliance & {
        captain: Team;
        firstPick: Team;
      })[];
    };

export async function divisionPredictionAndAlliances(
  userID: string,
  divisionKey: string
): Promise<DivisionPredictionAndAlliances | null> {
  return await prisma.divisionPrediction.findUnique({
    where: {
      userID_divisionKey: { userID, divisionKey },
    },
    include: {
      alliances: {
        include: {
          captain: true,
          firstPick: true,
        },
      },
    },
  });
}

export async function upsertDivisionPrediction(
  userID: string,
  divisionKey: string,
  averageQualificationMatchScore: number,
  averagePlayoffMatchScore: number,
  alliances: [string, string][],
  results: number[]
): Promise<void> {
  await prisma.divisionPrediction.upsert({
    where: {
      userID_divisionKey: { userID, divisionKey },
    },
    create: {
      user: {
        connect: {
          id: userID,
        },
      },
      division: {
        connect: {
          key: divisionKey,
        },
      },
      averageQualificationMatchScore,
      averagePlayoffMatchScore,
      alliances: {
        createMany: {
          data: alliances.map((alliance, index) => ({
            number: index + 1,
            captainTeamKey: alliance[0],
            firstPickTeamKey: alliance[1],
          })),
        },
      },
      results,
    },
    update: {
      averageQualificationMatchScore,
      averagePlayoffMatchScore,
      alliances: {
        updateMany: alliances.map((alliance, index) => ({
          where: {
            divisionPredictionUserID: userID,
            divisionPredictionDivisionKey: divisionKey,
            number: index + 1,
          },
          data: {
            captainTeamKey: alliance[0],
            firstPickTeamKey: alliance[1],
          },
        })),
      },
      results,
    },
  });
}

export { prisma };
