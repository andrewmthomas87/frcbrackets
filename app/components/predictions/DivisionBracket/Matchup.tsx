import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import type { Alliance, UsePrediction } from "../usePrediction";
import AllianceCard from "./AllianceCard";

type Props = {
  isDisabled: boolean;
  n: number;
  red: {
    number: number;
    alliance: Alliance;
  };
  blue: {
    number: number;
    alliance: Alliance;
  };
  selected: number;

  lookupTeam: UsePrediction["lookupTeam"];
  onSelect(alliance: number): void;
};

export default function Matchup({
  isDisabled,
  n,
  red,
  blue,
  selected,
  lookupTeam,
  onSelect,
}: Props): JSX.Element {
  const onSelectRed = useCallback(() => onSelect(red.number), [red, onSelect]);
  const onSelectBlue = useCallback(
    () => onSelect(blue.number),
    [blue, onSelect]
  );

  return (
    <Stack direction="row" spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold">
        {n}.
      </Typography>
      <Stack direction={["column", "row"]} spacing={[2, 2]} alignItems="center">
        <AllianceCard
          isDisabled={isDisabled}
          isRed={true}
          alliance={red}
          isSelected={
            selected === red.number
              ? true
              : selected === blue.number
              ? false
              : null
          }
          lookupTeam={lookupTeam}
          onSelect={onSelectRed}
        />
        <Typography variant="body2">vs.</Typography>
        <AllianceCard
          isDisabled={isDisabled}
          isRed={false}
          alliance={blue}
          isSelected={
            selected === blue.number
              ? true
              : selected === red.number
              ? false
              : null
          }
          lookupTeam={lookupTeam}
          onSelect={onSelectBlue}
        />
      </Stack>
    </Stack>
  );
}
