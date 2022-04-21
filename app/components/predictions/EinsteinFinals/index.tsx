import { Box, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import { useMemo } from "react";
import Question from "../Question";
import type { UseEinsteinPrediction } from "../useEinsteinPrediction";
import DivisionSelect from "./DivisionSelect";
import FinalMatchup from "./FinalMatchup";

type Props = {
  isLocked: boolean;
  isDisabled: boolean;
  divisions: Division[];
  results: (string | null)[];
  firstSeed: string | null;
  secondSeed: string | null;
  winner: string | null;

  lookupDivision: UseEinsteinPrediction["lookupDivision"];
  setFirstSeed: UseEinsteinPrediction["setFirstSeed"];
  setSecondSeed: UseEinsteinPrediction["setSecondSeed"];
  setWinner: UseEinsteinPrediction["setWinner"];
};

export default function EinsteinFinals({
  isLocked,
  isDisabled,
  divisions,
  results,
  firstSeed,
  secondSeed,
  winner,
  lookupDivision,
  setFirstSeed,
  setSecondSeed,
  setWinner,
}: Props): JSX.Element {
  const championshipPoints = useMemo(() => {
    const championshipPoints = Object.fromEntries(
      divisions.map((division) => [division.key, 0])
    );
    results
      .filter((result): result is string => !!result)
      .forEach((result) => (championshipPoints[result] += 2));
    return championshipPoints;
  }, [divisions, results]);

  const sortedDivisions = useMemo(() => {
    const sortedDivisions = divisions.slice();
    sortedDivisions.sort(
      (a, b) => championshipPoints[b.key] - championshipPoints[a.key]
    );
    return sortedDivisions;
  }, [divisions, championshipPoints]);

  const firstSeedDivisions = useMemo(
    () => sortedDivisions.filter(({ key }) => key !== secondSeed),
    [sortedDivisions, secondSeed]
  );
  const secondSeedDivisions = useMemo(
    () => sortedDivisions.filter(({ key }) => key !== firstSeed),
    [sortedDivisions, firstSeed]
  );

  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Finals
      </Typography>
      <Typography variant="body1" gutterBottom>
        Predict the outcome of the finals.
      </Typography>
      <Stack direction="column" spacing={2} py={1}>
        <Question
          n={1}
          question="Which division will seed first?"
          input={
            <DivisionSelect
              isLocked={isLocked}
              isDisabled={isDisabled}
              label="First seed"
              division={firstSeed ? lookupDivision(firstSeed) : null}
              divisions={firstSeedDivisions}
              championshipPoints={championshipPoints}
              onSetDivisionKey={setFirstSeed}
            />
          }
        />
        <Question
          n={2}
          question="Which division will seed second?"
          input={
            <DivisionSelect
              isLocked={isLocked}
              isDisabled={isDisabled}
              label="Second seed"
              division={secondSeed ? lookupDivision(secondSeed) : null}
              divisions={secondSeedDivisions}
              championshipPoints={championshipPoints}
              onSetDivisionKey={setSecondSeed}
            />
          }
        />
        <Question
          n={3}
          question="Which division will win the championship?"
          input={
            <FinalMatchup
              isLocked={isLocked}
              isDisabled={isDisabled}
              firstSeed={firstSeed}
              secondSeed={secondSeed}
              winner={winner}
              lookupDivision={lookupDivision}
              setWinner={setWinner}
            />
          }
        />
      </Stack>
    </Box>
  );
}
