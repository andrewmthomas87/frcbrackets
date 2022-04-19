import { ArrowForward, Check } from "@mui/icons-material";
import {
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import Page from "~/components/Page";
import { prisma } from "~/db.server";
import { requireUser } from "~/session.server";

type LoaderData = {
  user: User;
  divisions: {
    key: string;
    name: string;
    teams: {
      key: string;
      name: string;
      teamNumber: number;
    }[];
  }[];
  predictions: {
    divisionKey: string;
  }[];
  einsteinPrediction: boolean;
  allTeams: {
    key: string;
    name: string;
    teamNumber: number;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const divisions = await prisma.division.findMany({
    select: {
      key: true,
      name: true,
      teams: {
        select: {
          key: true,
          teamNumber: true,
          name: true,
        },
        take: 5,
        orderBy: {
          stats: {
            unpenalizedTotalPoints: "desc",
          },
        },
      },
    },
  });

  const predictions = await prisma.divisionPrediction.findMany({
    where: { userID: user.id },
    orderBy: {
      division: {
        name: "asc",
      },
    },
    select: {
      divisionKey: true,
    },
  });

  const einsteinPrediction = !!(await prisma.einsteinPrediction.findUnique({
    where: { userID: user.id },
    select: {
      userID: true,
    },
  }));

  const allTeams = await prisma.team.findMany({
    where: { division: { isNot: null } },
    select: {
      key: true,
      teamNumber: true,
      name: true,
    },
    take: 5,
    orderBy: {
      stats: {
        unpenalizedTotalPoints: "desc",
      },
    },
  });

  return json<LoaderData>({
    user,
    divisions,
    predictions,
    einsteinPrediction,
    allTeams,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard - frcbrackets",
  };
};

export default function DashboardPage(): JSX.Element {
  const { user, divisions, predictions, einsteinPrediction, allTeams } =
    useLoaderData<LoaderData>();

  const predictionsSet = useMemo(
    () => new Set(predictions.map(({ divisionKey }) => divisionKey)),
    [predictions]
  );

  return (
    <Page maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Hello, <b>{user.username}</b>!
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Box overflow="auto">
        <Stack direction="row" spacing={2}>
          <Card variant="outlined" sx={{ minWidth: "25em" }}>
            <Box px={2} py={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" flex={1}>
                  Predictions
                </Typography>
                <Typography variant="body2">
                  {predictionsSet.size + (einsteinPrediction ? 1 : 0)} /{" "}
                  {divisions.length + 1}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <List>
              {divisions.map((division) => (
                <ListItem key={division.key} disablePadding>
                  <ListItemButton
                    component={RemixLink}
                    to={`/predictions/${division.key}`}
                  >
                    <ListItemText>{division.name}</ListItemText>
                    <ListItemIcon>
                      {predictionsSet.has(division.key) ? (
                        <Check color="success" fontSize="small" />
                      ) : (
                        <ArrowForward color="secondary" fontSize="small" />
                      )}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  component={RemixLink}
                  to={`/predictions/einstein`}
                >
                  <ListItemText>Einstein Field</ListItemText>
                  <ListItemIcon>
                    {einsteinPrediction ? (
                      <Check color="success" fontSize="small" />
                    ) : (
                      <ArrowForward color="secondary" fontSize="small" />
                    )}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            </List>
          </Card>
          <Card variant="outlined" sx={{ minWidth: "25em" }}>
            <Box px={2} py={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" flex={1}>
                  Data
                </Typography>
                <Typography variant="body2">Top teams by OPR</Typography>
              </Stack>
            </Box>
            <Divider />
            <List>
              {divisions.map((division) => (
                <ListItem key={division.key} disablePadding>
                  <ListItemButton
                    component={RemixLink}
                    to={`/data/${division.key}`}
                  >
                    <ListItemText>
                      <Stack direction="row" spacing={1}>
                        <Box flex={1}>{division.name}</Box>
                        <Typography variant="body2">
                          {division.teams
                            .map((team) => team.teamNumber)
                            .join(", ")}
                        </Typography>
                      </Stack>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem>
                <ListItemText>
                  <Stack direction="row" spacing={1}>
                    <Box flex={1}>All</Box>
                    <Typography variant="body2">
                      {allTeams.map((team) => team.teamNumber).join(", ")}
                    </Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
            </List>
          </Card>
        </Stack>
      </Box>
    </Page>
  );
}
