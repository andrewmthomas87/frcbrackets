import "dotenv/config";
import { prisma } from "~/db.server";
import { TBA } from "./api";
import {
  convertPrediction,
  divisionPredictionScore,
  tbaAlliancesToAlliances,
  tbaMatchesToPlayoffMatches,
  tbaRankingsToRankings,
} from "./scoring";

async function main() {
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

    for (let i = 0; i < datas.length; i++) {
      const prediction = predictions[i];
      const user = prediction.user;
      const data = datas[i];

      const score = divisionPredictionScore(
        {
          playoffMatches,
          rankings,
          alliances,
        },
        data
      );
      const sum =
        score.averageQualificationMatchScore +
        score.averagePlayoffMatchScore +
        score.alliances +
        score.bracket;

      prisma.divisionPredictionScore.create({
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

main();
