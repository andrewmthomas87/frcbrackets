import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import DivisionCard from "../DivisionCard";
import type { UseEinsteinPrediction } from "../useEinsteinPrediction";

type Props = {
  isDisabled: boolean;
  firstSeed: string | null;
  secondSeed: string | null;
  winner: string | null;

  lookupDivision: UseEinsteinPrediction["lookupDivision"];
  setWinner: UseEinsteinPrediction["setWinner"];
};

export default function FinalMatchup({
  isDisabled,
  firstSeed,
  secondSeed,
  winner,
  lookupDivision,
  setWinner,
}: Props): JSX.Element {
  const onSelectFirstSeed = useCallback(
    () => setWinner(firstSeed),
    [firstSeed, setWinner]
  );
  const onSelectSecondSeed = useCallback(
    () => setWinner(secondSeed),
    [secondSeed, setWinner]
  );

  if (!(firstSeed && secondSeed)) {
    return <Typography variant="body2">Seed selection unfinished</Typography>;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <DivisionCard
        isDisabled={isDisabled}
        isRed={true}
        divisionKey={firstSeed}
        isSelected={
          winner === firstSeed ? true : winner === secondSeed ? false : null
        }
        lookupDivision={lookupDivision}
        onSelect={onSelectFirstSeed}
      />
      <Typography variant="body2">vs.</Typography>
      <DivisionCard
        isDisabled={isDisabled}
        isRed={false}
        divisionKey={secondSeed}
        isSelected={
          winner === secondSeed ? true : winner === firstSeed ? false : null
        }
        lookupDivision={lookupDivision}
        onSelect={onSelectSecondSeed}
      />
    </Stack>
  );
}
