import { Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DivisionScoringAlliances from "./DivisionScoringAlliances";
import DivisionScoringBracket from "./DivisionScoringBracket";
import DivisionScoringStats from "./DivisionScoringStats";
import EinsteinScoringFinals from "./EinsteinScoringFinals";
import EinsteinScoringRoundRobin from "./EinsteinScoringRoundRobin";
import EinsteinScoringStats from "./EinsteinScoringStats";

export default function About(): JSX.Element {
  return (
    <Stack direction="column" spacing={2} divider={<Divider />}>
      <Typography variant="body1">
        Submit predictions for individual divisions or Einstein to participate
        in individual leaderboards. Submit predictions for everything to
        participate in the overall leaderboard.
      </Typography>
      <Box pb={2}>
        <Typography variant="h5" component="h2" gutterBottom>
          Division scoring
        </Typography>
        <Stack direction="column" spacing={3}>
          <DivisionScoringStats />
          <DivisionScoringAlliances />
          <DivisionScoringBracket />
        </Stack>
      </Box>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Einstein scoring
        </Typography>
        <Stack direction="column" spacing={3}>
          <EinsteinScoringStats />
          <EinsteinScoringRoundRobin />
          <EinsteinScoringFinals />
        </Stack>
      </Box>
    </Stack>
  );
}
