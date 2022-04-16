import { Typography } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import Page from "~/components/Page";

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard - frcbrackets",
  };
};

export default function DashboardPage(): JSX.Element {
  return (
    <Page>
      <Typography variant="h3" component="h1">
        Dashboard
      </Typography>
    </Page>
  );
}
