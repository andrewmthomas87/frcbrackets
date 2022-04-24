import { Typography } from "@mui/material";
import type { GridColDef, GridSortDirection } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { EinsteinPredictionScore } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { prisma } from "~/db.server";
import { arePredictionsLocked } from "~/utils";

type Score = EinsteinPredictionScore & {
  einsteinPrediction: {
    user: {
      username: string;
    };
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

  const scores = await prisma.einsteinPredictionScore.findMany({
    include: {
      einsteinPrediction: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  return json<LoaderData>({ isLocked, scores });
};

const SORT_ORDER_DESC_FIRST: GridSortDirection[] = ["desc", "asc", undefined];

export default function EinsteinTab(): JSX.Element {
  const { isLocked, scores } = useLoaderData<LoaderData>();

  const columns = useMemo((): GridColDef<Score>[] => {
    const sorted = scores.slice();
    sorted.sort((a, b) => b.sum - a.sum);

    const ranks: Record<string, number> = {};
    let r = 0;
    let prevScore = -1;
    for (const score of sorted) {
      if (score.sum !== prevScore) {
        r++;
      }

      ranks[score.einsteinPredictionUserID] = r;
      prevScore = score.sum;
    }

    return [
      {
        field: "#",
        width: 50,
        type: "number",
        valueGetter: ({ row }) => ranks[row.einsteinPredictionUserID],
      },
      {
        field: "username",
        width: 150,
        valueGetter: ({ row }) => row.einsteinPrediction.user.username,
      },
      {
        field: "score",
        type: "number",
        valueGetter: ({ row }) => row.sum,
        sortingOrder: SORT_ORDER_DESC_FIRST,
      },
      ...(
        [
          "averageRRAllianceHangarPoints",
          "averageFinalsMatchScore",
          "results",
          "firstSeed",
          "secondSeed",
          "winner",
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
      getRowId={(score) => score.einsteinPredictionUserID}
    />
  );
}
