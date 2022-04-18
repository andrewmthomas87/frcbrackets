import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  n: number;
  question: ReactNode;
  input: ReactNode;
};

export default function Question({ n, question, input }: Props): JSX.Element {
  return (
    <Stack direction="row" spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold">
        {n}.
      </Typography>
      <Stack direction="column" alignItems="flex-start">
        <Typography variant="body1" gutterBottom>
          {question}
        </Typography>
        {input}
      </Stack>
    </Stack>
  );
}
