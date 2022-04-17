import { Box, Stack, Typography } from "@mui/material";
import type { UsePrediction } from "../usePrediction";
import MatchScoreInput from "./MatchScoreInput";
import Question from "./Question";

type Props = {
  isDisabled: boolean;
  averageQualificationMatchScore: number;
  averagePlayoffMatchScore: number;

  setAverageQualificationMatchScore: UsePrediction["setAverageQualificationMatchScore"];
  setAveragePlayoffMatchScore: UsePrediction["setAveragePlayoffMatchScore"];
};

export default function DivisionStats({
  isDisabled,
  averageQualificationMatchScore,
  averagePlayoffMatchScore,
  setAverageQualificationMatchScore,
  setAveragePlayoffMatchScore,
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
              What will be the <b>Average Qualification Match Score</b> of the
              first seed?
            </>
          }
          input={
            <MatchScoreInput
              value={averageQualificationMatchScore}
              isDisabled={isDisabled}
              onSetValue={setAverageQualificationMatchScore}
            />
          }
        />
        <Question
          n={2}
          question={
            <>
              What will be the <b>Average Playoff Match Score</b> of the winning
              alliance?
            </>
          }
          input={
            <MatchScoreInput
              value={averagePlayoffMatchScore}
              isDisabled={isDisabled}
              onSetValue={setAveragePlayoffMatchScore}
            />
          }
        />
      </Stack>
    </Box>
  );
}
