import { Link, Tab, Tabs, Typography } from "@mui/material";
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
    title: "Data - frcbrackets",
  };
};

export default function DataPage(): JSX.Element {
  const divisions = useLoaderData<Division[]>();

  const matches = useMatches();
  const divisionKey = matches[matches.length - 1].params["divisionKey"];

  return (
    <Page maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Data
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Team stats for the 2022 season broken down by division. Sourced from{" "}
        <Link
          href="https://github.com/inkling16/SykesScoutingDatabase"
          target="_blank"
        >
          SykesScoutingDatabase
        </Link>
        .
      </Typography>
      <Tabs variant="scrollable" value={divisionKey || "about"} sx={{ mb: 2 }}>
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
      </Tabs>
      <Outlet />
    </Page>
  );
}
