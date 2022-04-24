import { Typography } from "@mui/material";
import type { GridColDef, GridSortDirection } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { GlobalScore } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { prisma } from "~/db.server";
import { arePredictionsLocked } from "~/utils";

type Score = GlobalScore & {
  user: {
    username: string;
  };
};

type LoaderData = {
  isLocked: boolean;
  scores: Score[];
};

export const loader: LoaderFunction = async () => {
  const isLocked = arePredictionsLocked();
  if (!isLocked) {
    return json<LoaderData>({ isLocked, scores: [] });
  }

  const scores = await prisma.globalScore.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return { isLocked, scores };
};

const SORT_ORDER_DESC_FIRST: GridSortDirection[] = ["desc", "asc", undefined];

export default function GlobalTab(): JSX.Element {
  const { isLocked, scores } = useLoaderData<LoaderData>();

  const columns = useMemo((): GridColDef<Score>[] => {
    const sorted = scores.slice();
    sorted.sort((a, b) => sum(b) - sum(a));

    const sums: Record<string, number> = {};
    const ranks: Record<string, number> = {};
    let r = 0;
    let prevScore = -1;
    for (const score of sorted) {
      const s = sum(score);
      if (s !== prevScore) {
        r++;
      }

      sums[score.userID] = s;
      ranks[score.userID] = r;
      prevScore = s;
    }

    return [
      {
        field: "#",
        width: 50,
        type: "number",
        valueGetter: ({ row }) => ranks[row.userID],
      },
      {
        field: "username",
        width: 150,
        valueGetter: ({ row }) => row.user.username,
      },
      {
        field: "score",
        type: "number",
        valueGetter: ({ row }) => sums[row.userID],
        sortingOrder: SORT_ORDER_DESC_FIRST,
      },
      ...(
        [
          "carvScore",
          "galScore",
          "hopScore",
          "newScore",
          "roeScore",
          "turScore",
          "einsteinScore",
        ] as const
      ).map(
        (key): GridColDef<Score> => ({
          field: key,
          type: "number",
          valueGetter: ({ row }) => row[key],
          sortingOrder: SORT_ORDER_DESC_FIRST,
        })
      ),
    ];
  }, [scores]);

  if (!isLocked) {
    return (
      <Typography variant="body1">
        Nothing here... check back after the competition starts.
      </Typography>
    );
  }

  return (
    <DataGrid
      columns={columns}
      rows={scores}
      density="compact"
      initialState={{
        sorting: {
          sortModel: [
            {
              field: "#",
              sort: "asc",
            },
          ],
        },
      }}
      autoHeight
      pageSize={100}
      hideFooter={scores.length <= 100}
      getRowId={(score) => score.userID}
    />
  );
}

function sum(score: GlobalScore): number {
  return (
    score.carvScore +
    score.galScore +
    score.hopScore +
    score.newScore +
    score.roeScore +
    score.turScore +
    score.einsteinScore
  );
}
