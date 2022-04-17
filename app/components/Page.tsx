import type { ContainerProps } from "@mui/material";
import { Container, Link, Paper, Stack, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  maxWidth?: ContainerProps["maxWidth"];
}>;

export default function Page({
  children,
  maxWidth = "md",
}: Props): JSX.Element {
  return (
    <>
      <Container maxWidth={maxWidth} sx={{ mb: 3 }}>
        <Paper variant="outlined" sx={{ px: 4, py: 3, my: 2 }}>
          {children}
        </Paper>
      </Container>
      <Container maxWidth={maxWidth} component="footer">
        <Stack direction="column" p={2} alignItems="center">
          <Typography variant="caption">
            &copy; 2022{" "}
            <Link target="_blank" href="https://andrewt.io">
              Andrew Thomas
            </Link>
          </Typography>
          <Typography variant="caption">
            Powered by{" "}
            <Link target="_blank" href="https://www.thebluealliance.com">
              The Blue Alliance
            </Link>{" "}
            &{" "}
            <Link
              href="https://github.com/inkling16/SykesScoutingDatabase"
              target="_blank"
            >
              SykesScoutingDatabase
            </Link>
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
