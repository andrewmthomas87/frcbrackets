import { Box, Stack, Typography } from "@mui/material";
import Question from "./Question";
import ScoreInput from "./ScoreInput";
import type { UseEinsteinPrediction } from "./useEinsteinPrediction";

type Props = {
  isDisabled: boolean;
  averageRRAllianceHangarPoints: number;
  averageFinalsMatchScore: number;

  setAverageRRAllianceHangarPoints: UseEinsteinPrediction["setAverageRRAllianceHangarPoints"];
  setAverageFinalsMatchScore: UseEinsteinPrediction["setAverageFinalsMatchScore"];
};

export default function EinsteinStats({
  isDisabled,
  averageRRAllianceHangarPoints,
  averageFinalsMatchScore,
  setAverageRRAllianceHangarPoints,
  setAverageFinalsMatchScore,
}: Props): JSX.Element {
  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Stats
      </Typography>
      <Typography variant="body1" gutterBottom>
        Predict miscellaneous stats.
      </Typography>
      <Stack direction="column" spacing={2} py={1}>
        <Question
          n={1}
          question={
            <>
              What will be the <b>Average Alliance Hangar Points</b> of the
              first seed at the conclusion of the round robin tournament?
            </>
          }
          input={
            <ScoreInput
              label="Alliance hangar points"
              value={averageRRAllianceHangarPoints}
              isDisabled={isDisabled}
              onSetValue={setAverageRRAllianceHangarPoints}
            />
          }
        />
        <Question
          n={2}
          question={
            <>
              What will be the <b>Average Finals Match Score</b> of the winning
              alliance?
            </>
          }
          input={
            <ScoreInput
              label="Match score"
              value={averageFinalsMatchScore}
              isDisabled={isDisabled}
              onSetValue={setAverageFinalsMatchScore}
            />
          }
        />
      </Stack>
    </Box>
  );
}
