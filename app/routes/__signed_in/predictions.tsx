import { Tab, Tabs, Typography } from "@mui/material";
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
    title: "Predictions - frcbrackets",
  };
};

export default function PredictionsPage(): JSX.Element {
  const divisions = useLoaderData<Division[]>();

  const matches = useMatches();
  let tab: string;
  const divisionKey = matches[matches.length - 1].params["divisionKey"];
  if (divisionKey) {
    tab = divisionKey;
  } else if (matches[matches.length - 1].pathname.endsWith("einstein")) {
    tab = "einstein";
  } else {
    tab = "about";
  }

  return (
    <Page maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Predictions
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Your predictions for the 2022 FIRST Championship.
      </Typography>
      <Tabs variant="scrollable" value={tab} sx={{ mb: 2 }}>
        <Tab value="about" label="About" component={RemixLink} to="" />
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
