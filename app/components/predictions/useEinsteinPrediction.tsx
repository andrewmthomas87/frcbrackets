import type { Division } from "@prisma/client";
import produce from "immer";
import { useCallback, useMemo, useState } from "react";

export type EinsteinPrediction = {
  averageRRAllianceHangarPoints: number;
  averageFinalsMatchScore: number;
  results: string[];
  firstSeed: string;
  secondSeed: string;
  winner: string;
};

export type UseEinsteinPrediction = ReturnType<typeof useEinsteinPrediction>;

export default function useEinsteinPrediction(divisions: Division[]) {
  const divisionsMap = useMemo(
    () =>
      Object.fromEntries(divisions.map((division) => [division.key, division])),
    [divisions]
  );

  const [averageRRAllianceHangarPoints, setAverageRRAllianceHangarPoints] =
    useState(NaN);
  const [averageFinalsMatchScore, setAverageFinalsMatchScore] = useState(NaN);

  const [results, setResults] = useState<(string | null)[]>(() =>
    new Array(15).fill(null)
  );

  const [firstSeed, _setFirstSeed] = useState<string | null>(null);
  const [secondSeed, _setSecondSeed] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const prediction = useMemo<EinsteinPrediction | null>(() => {
    if (isNaN(averageRRAllianceHangarPoints)) {
      return null;
    } else if (isNaN(averageFinalsMatchScore)) {
      return null;
    }

    const filledResults = results.filter(
      (division): division is string => !!division
    );
    if (filledResults.length !== 15) {
      return null;
    }

    if (!(firstSeed && secondSeed && winner)) {
      return null;
    }

    return {
      averageRRAllianceHangarPoints,
      averageFinalsMatchScore,
      results: filledResults,
      firstSeed,
      secondSeed,
      winner,
    };
  }, [
    averageRRAllianceHangarPoints,
    averageFinalsMatchScore,
    results,
    firstSeed,
    secondSeed,
    winner,
  ]);

  const lookupDivision = useCallback(
    (divisionKey: string) => divisionsMap[divisionKey],
    [divisionsMap]
  );

  const setResult = useCallback(
    (matchup: number, divisionKey: string) =>
      setResults(
        produce(results, (results) => {
          results[matchup] = divisionKey;
        })
      ),
    [results]
  );

  const setFirstSeed = useCallback((divisionKey: string) => {
    _setFirstSeed(divisionKey);
    setWinner(null);
  }, []);
  const setSecondSeed = useCallback((divisionKey: string) => {
    _setSecondSeed(divisionKey);
    setWinner(null);
  }, []);

  return {
    averageRRAllianceHangarPoints,
    averageFinalsMatchScore,
    results,
    firstSeed,
    secondSeed,
    winner,
    prediction,

    lookupDivision,
    setAverageRRAllianceHangarPoints,
    setAverageFinalsMatchScore,
    setResult,
    setFirstSeed,
    setSecondSeed,
    setWinner,
  };
}
