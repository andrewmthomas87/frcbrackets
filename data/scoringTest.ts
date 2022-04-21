import "dotenv/config";
import { TBA } from "./api";
import {
  divisionPredictionScore,
  tbaAlliancesToAlliances,
  tbaMatchesToPlayoffMatches,
  tbaRankingsToRankings,
} from "./scoring";

async function main() {
  const tbaMatches = await TBA.eventMatchesSimple("2022micmp2");
  const tbaRankings = await TBA.eventRankings("2022micmp2");
  const tbaAlliances = await TBA.eventAlliances("2022micmp2");

  const playoffMatches = tbaMatchesToPlayoffMatches(tbaMatches);
  const rankings = tbaRankingsToRankings(tbaRankings);
  const alliances = tbaAlliancesToAlliances(tbaAlliances);

  const score = divisionPredictionScore(
    {
      playoffMatches,
      rankings,
      alliances,
    },
    {
      alliances: alliances.map((alliance) => ({
        ...alliance,
        pickKeys: alliance.pickKeys.slice(0, 2),
      })),
      averagePlayoffMatchScore: 124,
      averageQualificationMatchScore: 102,
    }
  );

  console.log(score);
}

main();
