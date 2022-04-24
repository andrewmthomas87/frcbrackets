import "dotenv/config";
import { prisma } from "~/db.server";
import { TBA } from "./api";
import type { DivisionData, EinsteinData } from "./scoring";
import {
  convertPrediction,
  divisionPredictionScore,
  einsteinPredictionScore,
  tbaAlliancesToAlliances,
  tbaMatchesToPlayoffMatches,
  tbaRankingsToRankings,
} from "./scoring";

async function scoreDivisions() {
  const divisions = await prisma.division.findMany();

  for (const division of divisions) {
    const predictions = await prisma.divisionPrediction.findMany({
      where: {
        division: { key: division.key },
      },
      include: {
        alliances: true,
        user: true,
      },
    });
    const datas = predictions.map(convertPrediction);

    const tbaMatches = await TBA.eventMatchesSimple(division.key);
    const tbaRankings = await TBA.eventRankings(division.key);
    const tbaAlliances = await TBA.eventAlliances(division.key);

    const playoffMatches = tbaMatchesToPlayoffMatches(tbaMatches);
    const rankings = tbaRankingsToRankings(tbaRankings);
    const alliances = tbaAlliancesToAlliances(tbaAlliances);

    const data: DivisionData = {
      playoffMatches,
      rankings,
      alliances,
    };

    for (let i = 0; i < datas.length; i++) {
      const prediction = predictions[i];
      const user = prediction.user;
      const predictionData = datas[i];

      const score = divisionPredictionScore(data, predictionData);
      const sum =
        score.averageQualificationMatchScore +
        score.averagePlayoffMatchScore +
        score.alliances +
        score.bracket;

      await prisma.divisionPredictionScore.create({
        data: {
          divisionPrediction: {
            connect: {
              userID_divisionKey: {
                userID: user.id,
                divisionKey: prediction.divisionKey,
              },
            },
          },
          sum,
          averageQualificationMatchScore: score.averageQualificationMatchScore,
          averagePlayoffMatchScore: score.averagePlayoffMatchScore,
          alliances: score.alliances,
          bracket: score.bracket,
        },
      });
    }

    console.log(`Scored ${division.key}`);
  }
}

const EINSTEIN_AVERAGE_RR_ALLIANCE_HANGAR_POINTS = 29.4;
const EINSTEIN_AVERAGE_FINALS_MATCH_SCORE = 134;
const EINSTEIN_RESULTS = [
  "2022tur",
  "2022gal",
  "2022new",
  "2022roe",
  "2022tur",
  "2022hop",
  "2022new",
  "2022hop",
  "2022gal",
  "2022carv",
  "2022gal",
  "2022tur",
  "2022carv",
  "2022tur",
  "2022new",
];
const EINSTEIN_FIRST_SEED = "2022tur";
const EINSTEIN_SECOND_SEED = "2022gal";
const EINSTEIN_WINNER = "2022gal";

async function scoreEinstein() {
  const predictions = await prisma.einsteinPrediction.findMany({
    include: { user: true },
  });
  const data: EinsteinData = {
    averageRRAllianceHangarPoints: EINSTEIN_AVERAGE_RR_ALLIANCE_HANGAR_POINTS,
    averageFinalsMatchScore: EINSTEIN_AVERAGE_FINALS_MATCH_SCORE,
    results: EINSTEIN_RESULTS,
    firstSeed: EINSTEIN_FIRST_SEED,
    secondSeed: EINSTEIN_SECOND_SEED,
    winner: EINSTEIN_WINNER,
  };

  for (const prediction of predictions) {
    const score = einsteinPredictionScore(data, prediction);
    const sum =
      score.averageRRAllianceHangarPoints +
      score.averageFinalsMatchScore +
      score.results +
      score.firstSeed +
      score.secondSeed +
      score.winner;

    await prisma.einsteinPredictionScore.create({
      data: {
        einsteinPrediction: {
          connect: {
            userID: prediction.user.id,
          },
        },
        sum,
        averageRRAllianceHangarPoints: score.averageRRAllianceHangarPoints,
        averageFinalsMatchScore: score.averageFinalsMatchScore,
        results: score.results,
        firstSeed: score.firstSeed,
        secondSeed: score.secondSeed,
        winner: score.winner,
      },
    });
  }

  console.log("Scored Einstein");
}

async function scoreGlobal() {
  const scores: Record<string, Record<string, number>> = {};

  const divisionScores = await prisma.divisionPredictionScore.findMany();
  for (const score of divisionScores) {
    scores[score.divisionPredictionUserID] = {
      ...scores[score.divisionPredictionUserID],
      [score.divisionPredictionDivisionKey]: score.sum,
    };
  }

  const einsteinScores = await prisma.einsteinPredictionScore.findMany();
  for (const score of einsteinScores) {
    scores[score.einsteinPredictionUserID] = {
      ...scores[score.einsteinPredictionUserID],
      einstein: score.sum,
    };
  }

  for (const [userID, score] of Object.entries(scores)) {
    await prisma.globalScore.create({
      data: {
        user: {
          connect: {
            id: userID,
          },
        },
        carvScore: score["2022carv"] || 0,
        galScore: score["2022gal"] || 0,
        hopScore: score["2022hop"] || 0,
        newScore: score["2022new"] || 0,
        roeScore: score["2022roe"] || 0,
        turScore: score["2022tur"] || 0,
        einsteinScore: score["einstein"] || 0,
      },
    });
  }

  console.log("Scored global");
}

async function main() {
  try {
    await scoreDivisions();
    await scoreEinstein();
    await scoreGlobal();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
