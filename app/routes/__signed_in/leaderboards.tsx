import { Alert, Tab, Tabs, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link as RemixLink,
  Outlet,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import Page from "~/components/Page";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async () => {
  const divisions = await prisma.division.findMany({
    orderBy: { name: "asc" },
  });

  return json(divisions);
};

export const meta: MetaFunction = () => {
  return {
    title: "Leaderboards - frcbrackets",
  };
};

export default function LeaderboardsPage(): JSX.Element {
  const divisions = useLoaderData<Division[]>();

  const matches = useMatches();
  let tab: string;
  const divisionKey = matches[matches.length - 1].params["divisionKey"];
  if (divisionKey) {
    tab = divisionKey;
  } else {
    tab = "einstein";
  }

  return (
    <Page maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Leaderboards
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Leaderboards for the 2022 <i>FIRST</i> <sup>®</sup> Robotics Competition
        Championship
      </Typography>
      <Alert variant="filled" severity="info" sx={{ my: 2 }}>
        Leaderboards will be available starting 8 AM Thu, April 21
      </Alert>
      <Tabs variant="scrollable" value={tab} sx={{ mb: 2 }}>
        {divisions.map((division) => (
          <Tab
            key={division.key}
            value={division.key}
            label={division.name.split(" ")[0]}
            component={RemixLink}
            to={division.key}
          />
        ))}
        <Tab
          value="einstein"
          label="Einstein"
          component={RemixLink}
          to="einstein"
        />
      </Tabs>
      <Outlet key={tab} />
    </Page>
  );
}
