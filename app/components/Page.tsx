import type { ContainerProps } from "@mui/material";
import { Container, Paper } from "@mui/material";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  maxWidth?: ContainerProps["maxWidth"];
}>;

export default function Page({
  children,
  maxWidth = "md",
}: Props): JSX.Element {
  return (
    <Container maxWidth={maxWidth}>
      <Paper variant="outlined" sx={{ px: 4, py: 3, my: 2 }}>
        {children}
      </Paper>
    </Container>
  );
}
