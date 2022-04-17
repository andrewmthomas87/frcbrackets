import { LoadingButton } from "@mui/lab";
import { Alert, Stack } from "@mui/material";
import { Form } from "@remix-run/react";
import type { Predictions } from "./usePredictions";

type Props = {
  isSubmitting: boolean;
  result: { error?: string } | undefined;
  predictions: Predictions | null;
};

export default function DivisionSubmit({
  isSubmitting,
  result,
  predictions,
}: Props): JSX.Element {
  return (
    <Stack direction="column" spacing={2} alignItems="flex-start">
      {result &&
        (result.error ? (
          <Alert severity="error" variant="outlined">
            {result.error}
          </Alert>
        ) : (
          <Alert severity="success" variant="outlined">
            Predictions saved!
          </Alert>
        ))}
      <Form method="post" replace>
        <input
          name="predictions"
          type="hidden"
          required
          value={JSON.stringify(predictions)}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          disabled={!predictions}
          loading={isSubmitting}
        >
          Save predictions
        </LoadingButton>
      </Form>
    </Stack>
  );
}
