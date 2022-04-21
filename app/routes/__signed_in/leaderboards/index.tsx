import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { arePredictionsLocked } from "~/utils";

type LoaderData = {
  isLocked: boolean;
  usernames: string[];
};

export const loader: LoaderFunction = async () => {
  const isLocked = arePredictionsLocked();
  if (!isLocked) {
    return json<LoaderData>({ isLocked, usernames: [] });
  }

  const divisionPredictionUsers = await prisma.divisionPrediction.findMany({
    select: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  const einsteinPredictionUsers = await prisma.einsteinPrediction.findMany({
    select: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  const usernames = Array.from(
    new Set(
      divisionPredictionUsers
        .map((value) => value.user.username)
        .concat(einsteinPredictionUsers.map((value) => value.user.username))
    ).values()
  );
  usernames.sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? 1 : -1));

  return { isLocked, usernames };
};

export default function GlobalTab(): JSX.Element {
  const { isLocked, usernames } = useLoaderData<LoaderData>();

  const theme = useTheme();

  if (!isLocked) {
    return (
      <Typography variant="body1">
        Nothing here... check back after the competition starts.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: theme.breakpoints.values.sm }}>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usernames.map((username) => (
            <TableRow key={username}>
              <TableCell>{username}</TableCell>
              <TableCell>0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
