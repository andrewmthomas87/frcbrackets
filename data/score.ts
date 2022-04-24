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

  for (let division of divisions) {
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

  for (let prediction of predictions) {
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

async function main() {
  try {
    await scoreDivisions();
    await scoreEinstein();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
