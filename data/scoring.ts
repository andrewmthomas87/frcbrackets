import type {
  DivisionPrediction,
  DivisionPredictionAlliance,
  User,
} from "@prisma/client";
import type { TBA } from "./api";

export type DivisionPlayoffMatch = {
  compLevel: "qf" | "sf" | "f";
  blue: {
    teamKeys: string[];
    score: number;
  };
  red: {
    teamKeys: string[];
    score: number;
  };
};

export type DivisionRanking = {
  teamKey: string;
  rank: number;
  averageMatchScore: number;
};

export type DivisionAllianceAndResults = {
  pickKeys: string[];
  level: "qf" | "sf" | "f" | "w";
};

export type DivisionData = {
  playoffMatches: DivisionPlayoffMatch[];
  rankings: DivisionRanking[];
  alliances: DivisionAllianceAndResults[];
};

export type DivisionPredictionData = {
  averageQualificationMatchScore: number;
  averagePlayoffMatchScore: number;
  alliances: DivisionAllianceAndResults[];
};

export type DivisionPredictionScore = {
  averageQualificationMatchScore: number;
  averagePlayoffMatchScore: number;
  alliances: number;
  bracket: number;
};

export function divisionPredictionScore(
  data: DivisionData,
  prediction: DivisionPredictionData
): DivisionPredictionScore {
  const score: DivisionPredictionScore = {
    averageQualificationMatchScore: 0,
    averagePlayoffMatchScore: 0,
    alliances: 0,
    bracket: 0,
  };

  // averageQualificationMatchScore
  const firstRank = data.rankings.find(({ rank }) => rank === 1);
  if (firstRank) {
    score.averageQualificationMatchScore = Math.max(
      0,
      20 -
        Math.abs(
          Math.round(firstRank.averageMatchScore) -
            prediction.averageQualificationMatchScore
        )
    );
  }

  // averagePlayoffMatchScore
  const winningAlliance = data.alliances.find(({ level }) => level === "w");
  if (winningAlliance) {
    let n = 0;
    let sum = 0;
    for (const match of data.playoffMatches) {
      const isRed = winningAlliance.pickKeys.reduce(
        (curr, teamKey) => curr || match.red.teamKeys.indexOf(teamKey) > -1,
        false
      );
      const isBlue = winningAlliance.pickKeys.reduce(
        (curr, teamKey) => curr || match.blue.teamKeys.indexOf(teamKey) > -1,
        false
      );
      if (isRed) {
        n++;
        sum += match.red.score;
      } else if (isBlue) {
        n++;
        sum += match.blue.score;
      }
    }

    if (n > 0) {
      const averagePlayoffMatchScore = sum / n;
      score.averagePlayoffMatchScore = Math.max(
        0,
        20 -
          Math.abs(
            Math.round(averagePlayoffMatchScore) -
              prediction.averagePlayoffMatchScore
          )
      );
    }
  }

  // alliances
  const index: Record<string, number> = {};
  for (let i = 0; i < data.alliances.length; i++) {
    const alliance = data.alliances[i];
    index[alliance.pickKeys[0]] = i * 2 + 1;
    index[alliance.pickKeys[1]] = i * 2 + 2;
  }

  const predictionIndex: Record<string, number> = {};
  for (let i = 0; i < prediction.alliances.length; i++) {
    const alliance = prediction.alliances[i];
    predictionIndex[alliance.pickKeys[0]] = i * 2 + 1;
    predictionIndex[alliance.pickKeys[1]] = i * 2 + 2;
  }

  for (const teamKey of Object.keys(index)) {
    if (!(teamKey in predictionIndex)) {
      continue;
    }

    const i = index[teamKey];
    const predictionI = predictionIndex[teamKey];

    const difference = Math.max(0, 7 - Math.abs(i - predictionI));
    const isCorrect = i === predictionI;
    const isPartiallyCorrect =
      Math.floor((i - 1) / 2) === Math.floor((predictionI - 1) / 2);

    score.alliances +=
      difference + (isCorrect ? 3 : isPartiallyCorrect ? 2 : 0);
  }

  // bracket
  const atLeastSemis = new Set(
    data.alliances
      .filter(({ level }) => level === "sf" || level === "f" || level === "w")
      .map(({ pickKeys }) => pickKeys)
      .flat()
  );
  const finalists = new Set(
    data.alliances
      .filter(({ level }) => level === "f" || level === "w")
      .map(({ pickKeys }) => pickKeys)
      .flat()
  );
  const winners = new Set(
    data.alliances
      .filter(({ level }) => level === "w")
      .map(({ pickKeys }) => pickKeys)
      .flat()
  );

  const predictionAtLeastSemis = prediction.alliances
    .filter(({ level }) => level === "sf" || level === "f" || level === "w")
    .map(({ pickKeys }) => pickKeys)
    .flat();
  const predictionFinalists = prediction.alliances
    .filter(({ level }) => level === "f" || level === "w")
    .map(({ pickKeys }) => pickKeys)
    .flat();
  const predictionWinners = prediction.alliances
    .filter(({ level }) => level === "w")
    .map(({ pickKeys }) => pickKeys)
    .flat();

  const correctAtLeastSemis = predictionAtLeastSemis.filter((teamKey) =>
    atLeastSemis.has(teamKey)
  ).length;
  const correctFinalists = predictionFinalists.filter((teamKey) =>
    finalists.has(teamKey)
  ).length;
  const correctWinners = predictionWinners.filter((teamKey) =>
    winners.has(teamKey)
  ).length;

  score.bracket =
    10 * correctAtLeastSemis + 10 * correctFinalists + 20 * correctWinners;

  return score;
}

export function tbaMatchesToPlayoffMatches(
  tbaMatches: TBA.EventMatchSimple[]
): DivisionPlayoffMatch[] {
  return tbaMatches
    .filter(
      ({ alliances }) =>
        !(alliances.red.score === -1 || alliances.red.score === -1)
    )
    .filter(
      ({ comp_level }) =>
        comp_level === "qf" || comp_level === "sf" || comp_level === "f"
    )
    .map(
      (tbaMatch): DivisionPlayoffMatch => ({
        compLevel: tbaMatch.comp_level as DivisionPlayoffMatch["compLevel"],
        blue: {
          score: tbaMatch.alliances.blue.score,
          teamKeys: tbaMatch.alliances.blue.team_keys,
        },
        red: {
          score: tbaMatch.alliances.red.score,
          teamKeys: tbaMatch.alliances.red.team_keys,
        },
      })
    );
}

export function tbaRankingsToRankings(
  tbaRankings: TBA.Ranking[]
): DivisionRanking[] {
  return tbaRankings.map((tbaRanking) => ({
    rank: tbaRanking.rank,
    teamKey: tbaRanking.team_key,
    averageMatchScore: tbaRanking.sort_orders[1],
  }));
}

export function tbaAlliancesToAlliances(
  tbaAlliances: TBA.Alliance[]
): DivisionAllianceAndResults[] {
  return tbaAlliances
    .filter(
      ({ status: { level } }) =>
        level === "qf" || level === "sf" || level === "f"
    )
    .map((tbaAlliance) => ({
      level:
        tbaAlliance.status.level === "f" && tbaAlliance.status.status === "won"
          ? "w"
          : (tbaAlliance.status.level as "qf" | "sf" | "f"),
      pickKeys: tbaAlliance.picks,
    }));
}

export type DivisionPredictionAndAlliancesAndUser = DivisionPrediction & {
  alliances: DivisionPredictionAlliance[];
  user: User;
};

export function convertPrediction(
  prediction: DivisionPredictionAndAlliancesAndUser
): DivisionPredictionData {
  prediction.alliances.sort((a, b) => a.number - b.number);
  const alliances = prediction.alliances.map<DivisionAllianceAndResults>(
    (alliance) => ({
      level: "qf",
      pickKeys: [alliance.captainTeamKey, alliance.firstPickTeamKey],
    })
  );

  prediction.results.slice(0, 4).map((n) => (alliances[n - 1].level = "sf"));
  prediction.results.slice(4, 6).map((n) => (alliances[n - 1].level = "f"));
  alliances[prediction.results[6] - 1].level = "w";

  const { averageQualificationMatchScore, averagePlayoffMatchScore } =
    prediction;

  return {
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
  };
}
