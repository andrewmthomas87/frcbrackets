import { LoadingButton } from "@mui/lab";
import { Alert, Stack } from "@mui/material";
import { Form } from "@remix-run/react";
import type { Prediction } from "./useEinsteinPrediction";

type Props = {
  isSubmitting: boolean;
  result: { error?: string } | undefined;
  prediction: Prediction | null;
};

export default function EinsteinSubmit({
  isSubmitting,
  result,
  prediction,
}: Props): JSX.Element {
  return (
    <Stack direction="column" spacing={2} alignItems="flex-start">
      {result &&
        (result.error ? (
          <Alert severity="error" variant="filled">
            {result.error}
          </Alert>
        ) : (
          <Alert severity="success" variant="filled">
            Predictions saved!
          </Alert>
        ))}
      <Form method="post" replace>
        <input
          name="prediction"
          type="hidden"
          required
          value={JSON.stringify(prediction)}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          disabled={!prediction}
          loading={isSubmitting}
        >
          Save predictions
        </LoadingButton>
      </Form>
    </Stack>
  );
}
