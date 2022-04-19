import { Typography } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import Page from "~/components/Page";
import About from "~/components/predictions/About";

export const meta: MetaFunction = () => {
  return {
    title: "Scoring - frcbrackets",
  };
};

export default function ScoringPage(): JSX.Element {
  return (
    <Page maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Scoring
      </Typography>
      <About />
    </Page>
  );
}
