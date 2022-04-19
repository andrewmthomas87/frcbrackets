import { Box, Typography } from "@mui/material";
import Header from "./Header";

export default function EinsteinScoringRoundRobin(): JSX.Element {
  return (
    <Box>
      <Header title="Round robin" maxScore={225} />
      <Typography variant="body1">
        15 points for each correct head-to-head prediction.
      </Typography>
    </Box>
  );
}
