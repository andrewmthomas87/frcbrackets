import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import DivisionCard from "../DivisionCard";
import type { UseEinsteinPrediction } from "../useEinsteinPrediction";

type Props = {
  isLocked: boolean;
  isDisabled: boolean;
  n: number;
  red: string;
  blue: string;
  selected: string | null;

  lookupDivision: UseEinsteinPrediction["lookupDivision"];
  onSelect(divisionKey: string): void;
};

export default function Matchup({
  isLocked,
  isDisabled,
  n,
  red,
  blue,
  selected,
  lookupDivision,
  onSelect,
}: Props): JSX.Element {
  const onSelectRed = useCallback(() => onSelect(red), [red, onSelect]);
  const onSelectBlue = useCallback(() => onSelect(blue), [blue, onSelect]);

  return (
    <Stack direction="row" spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold" width="1.25em">
        {n}.
      </Typography>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <DivisionCard
          isDisabled={isDisabled}
          isRed={true}
          divisionKey={red}
          isSelected={
            selected === red ? true : selected === blue ? false : null
          }
          lookupDivision={lookupDivision}
          onSelect={isLocked ? () => {} : onSelectRed}
        />
        <Typography variant="body2">vs.</Typography>
        <DivisionCard
          isDisabled={isDisabled}
          isRed={false}
          divisionKey={blue}
          isSelected={
            selected === blue ? true : selected === red ? false : null
          }
          lookupDivision={lookupDivision}
          onSelect={isLocked ? () => {} : onSelectBlue}
        />
      </Stack>
    </Stack>
  );
}
