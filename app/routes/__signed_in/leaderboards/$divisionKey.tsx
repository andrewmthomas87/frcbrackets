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

export const loader: LoaderFunction = async ({ params }) => {
  const divisionKey = params["divisionKey"];

  const isLocked = arePredictionsLocked();
  if (!isLocked) {
    return json<LoaderData>({ isLocked, usernames: [] });
  }

  const divisionPredictionUsers = await prisma.divisionPrediction.findMany({
    where: {
      divisionKey,
    },
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
      divisionPredictionUsers.map((value) => value.user.username)
    ).values()
  );
  usernames.sort();

  return { isLocked, usernames };
};

export default function DivisionTab(): JSX.Element {
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
