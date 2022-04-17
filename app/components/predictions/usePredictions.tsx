import produce from "immer";
import { useCallback, useMemo, useState } from "react";
import type { SimpleTeamAndStats } from "~/db.server";

export type Alliance = [string | null, string | null];

export type Predictions = {
  averageQualificationMatchScore: number;
  averagePlayoffMatchScore: number;
  alliances: [string, string][];
  results: number[];
};

export type UsePredictions = ReturnType<typeof usePredictions>;

export default function usePredictions(teams: SimpleTeamAndStats[]) {
  const teamsMap = useMemo(
    () => Object.fromEntries(teams.map((team) => [team.key, team])),
    [teams]
  );
  const sortedTeams = useMemo(() => {
    const t = teams.slice(0);
    t.sort(
      (a, b) => b.stats.unpenalizedTotalPoints - a.stats.unpenalizedTotalPoints
    );
    return t;
  }, [teams]);

  const [averageQualificationMatchScore, setAverageQualificationMatchScore] =
    useState(NaN);
  const [averagePlayoffMatchScore, setAveragePlayoffMatchScore] = useState(NaN);

  const [alliances, setAlliances] = useState<Alliance[]>(() =>
    new Array(8).fill([null, null])
  );

  const [results, setResults] = useState<number[]>(new Array(7).fill(0));

  const predictions = useMemo<Predictions | null>(() => {
    if (isNaN(averageQualificationMatchScore)) {
      return null;
    } else if (isNaN(averagePlayoffMatchScore)) {
      return null;
    }

    const filledAlliances = alliances.filter(
      (alliance): alliance is [string, string] =>
        !(alliance[0] === null || alliance[1] === null)
    );
    if (filledAlliances.length < 8) {
      return null;
    }

    const filledResults = results.filter((alliance) => alliance > 0);
    if (filledResults.length < 7) {
      return null;
    }

    return {
      averageQualificationMatchScore,
      averagePlayoffMatchScore,
      alliances: filledAlliances,
      results: filledResults,
    };
  }, [
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
    results,
  ]);

  const lookupTeam = useCallback(
    (teamKey: string) => teamsMap[teamKey],
    [teamsMap]
  );

  const setAllianceTeam = useCallback(
    (alliance: number, isCaptain: boolean, teamKey: string | null) =>
      setAlliances(
        produce(alliances, (alliances) => {
          alliances[alliance - 1][isCaptain ? 0 : 1] = teamKey;
        })
      ),
    [alliances]
  );

  const setResult = useCallback(
    (matchup: number, alliance: number) =>
      setResults(
        produce(results, (results) => {
          if (results[matchup] === alliance) {
            return;
          }

          results[matchup] = alliance;
          if (matchup === 0 || matchup === 3) {
            results[4] = 0;
            results[6] = 0;
          } else if (matchup === 1 || matchup === 2) {
            results[5] = 0;
            results[6] = 0;
          } else if (matchup === 4 || matchup === 5) {
            results[6] = 0;
          }
        })
      ),
    [results]
  );

  return {
    sortedTeams,
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
    results,
    predictions,

    lookupTeam,
    setAverageQualificationMatchScore,
    setAveragePlayoffMatchScore,
    setAllianceTeam,
    setResult,
  };
}
