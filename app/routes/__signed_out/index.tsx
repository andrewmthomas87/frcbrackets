import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link as RemixLink } from "@remix-run/react";
import Page from "~/components/Page";
import About from "~/components/predictions/About";

export default function IndexPage(): JSX.Element {
  const theme = useTheme();

  return (
    <Page maxWidth="lg">
      <Stack direction="column" spacing={4} divider={<Divider />}>
        <Box>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            <span style={{ color: theme.palette.primary.light }}>frc</span>
            <span
              style={{
                color: theme.palette.getContrastText(
                  theme.palette.background.default
                ),
              }}
            >
              brackets
            </span>
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Predict outcomes of the 2022 <i>FIRST</i> <sup>®</sup> Robotics
            Competition Championship
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>
            Compete for 1<sup>st</sup> on the global leaderboard, or the
            individual division and Einstein leaderboards
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{ mt: 2 }}
            component={RemixLink}
            to="/join"
          >
            Create account
          </Button>
        </Box>
        <About />
      </Stack>
    </Page>
  );
}
