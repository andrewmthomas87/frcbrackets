import { Box, Stack, Typography } from "@mui/material";
import type { UseEinsteinPrediction } from "../useEinsteinPrediction";
import Matchup from "./Matchup";

type Props = {
  isDisabled: boolean;
  results: (string | null)[];

  lookupDivision: UseEinsteinPrediction["lookupDivision"];
  setResult: UseEinsteinPrediction["setResult"];
};

const MATCHUPS: [string, string][] = [
  ["2022carv", "2022tur"],
  ["2022gal", "2022roe"],
  ["2022hop", "2022new"],
  ["2022carv", "2022roe"],
  ["2022tur", "2022new"],
  ["2022gal", "2022hop"],
  ["2022carv", "2022new"],
  ["2022roe", "2022hop"],
  ["2022tur", "2022gal"],
  ["2022hop", "2022carv"],
  ["2022new", "2022gal"],
  ["2022roe", "2022tur"],
  ["2022gal", "2022carv"],
  ["2022hop", "2022tur"],
  ["2022new", "2022roe"],
];

export default function EinsteinRoundRobin({
  isDisabled,
  results,
  lookupDivision,
  setResult,
}: Props): JSX.Element {
  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Round robin
      </Typography>
      <Typography variant="body1" gutterBottom>
        Predict the head-to-head outcomes of the round robin tournament.
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        py={1}
        alignItems="flex-start"
        overflow="auto"
      >
        {MATCHUPS.map(([red, blue], index) => (
          <Matchup
            key={index}
            isDisabled={isDisabled}
            n={index + 1}
            red={red}
            blue={blue}
            selected={results[index]}
            lookupDivision={lookupDivision}
            onSelect={(division) => setResult(index, division)}
          />
        ))}
      </Stack>
    </Box>
  );
}
