import type { Team, TeamStats } from "@prisma/client";
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

export type TeamAndStats = Team & { stats: TeamStats };

export async function teamsAndStatsByDivision(
  divisionKey: string
): Promise<TeamAndStats[]> {
  const data = await prisma.team.findMany({
    where: {
      division: {
        key: divisionKey,
      },
    },
    include: {
      stats: true,
    },
  });

  return data.filter((value): value is TeamAndStats => !!value.stats);
}

export type SimpleTeamAndStats = Pick<Team, "key" | "teamNumber" | "name"> & {
  stats: Pick<TeamStats, "winningMarginElo" | "unpenalizedTotalPoints">;
};

export async function simpleTeamsAndStatsByDivision(
  divisionKey: string
): Promise<SimpleTeamAndStats[]> {
  const data = await prisma.team.findMany({
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
  });

  return data.filter((value): value is SimpleTeamAndStats => !!value.stats);
}

export type TeamKeyOnly = Pick<Team, "key">;

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

export { prisma };
