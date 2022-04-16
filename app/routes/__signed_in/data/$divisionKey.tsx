import type { GridColDef, GridSortDirection } from "@mui/x-data-grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { Division, Team, TeamStats } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

type TeamAndStats = Team & { stats: TeamStats | null };

export const loader: LoaderFunction = async ({ params }) => {
  const divisionKey = params["divisionKey"]!;

  const division = await prisma.division.findUnique({
    where: { key: divisionKey },
  });
  if (!division) {
    throw redirect("/data");
  }

  const teams = await prisma.team.findMany({
    where: {
      division: {
        key: division.key,
      },
    },
    include: {
      stats: true,
    },
  });

  return json({ division, teams });
};

type NWLT = [number, number, number, number];

function compareNWLT(a: NWLT, b: NWLT): number {
  const ratioA = a[1] / a[0];
  const ratioB = b[1] / b[0];
  if (ratioA - ratioB !== 0) {
    return ratioA - ratioB;
  }

  return a[0] - b[0];
}

function pluckStat<K extends keyof TeamStats>(
  key: K,
  defaultValue: TeamStats[K]
): ({ row }: { row: TeamAndStats }) => TeamStats[K] {
  return ({ row }) => (row.stats ? row.stats[key] : defaultValue);
}

const SORT_ORDER_DESC_FIRST: GridSortDirection[] = ["desc", "asc", undefined];

const COLUMNS: GridColDef<Team & { stats: TeamStats | null }>[] = [
  {
    field: "teamNumber",
    headerName: "#",
    width: 75,
    type: "number",
    valueFormatter: ({ value }) => value.toString(),
  },
  {
    field: "name",
    width: 200,
  },
  {
    field: "qualRecord",
    valueGetter: ({ row }): NWLT => [
      row.stats?.qualificationMatchesPlayed || 0,
      row.stats?.qualWins || 0,
      row.stats?.qualLosses || 0,
      row.stats?.qualTies || 0,
    ],
    sortComparator: compareNWLT,
    sortingOrder: SORT_ORDER_DESC_FIRST,
    valueFormatter: ({ value }: { value: NWLT }) => value.slice(1).join("-"),
  },
  {
    field: "totalRecord",
    valueGetter: ({ row }): NWLT => [
      row.stats?.totalMatchesPlayed || 0,
      row.stats?.totalWins || 0,
      row.stats?.totalLosses || 0,
      row.stats?.totalTies || 0,
    ],
    sortComparator: compareNWLT,
    sortingOrder: SORT_ORDER_DESC_FIRST,
    valueFormatter: ({ value }: { value: NWLT }) => value.slice(1).join("-"),
  },
  ...(
    [
      "dQMatches",
      "winningMarginElo",
      "totalPoints",
      "unpenalizedTotalPoints",
      "winningMargin",
      "win",
      "rankingPoints",
      "autoPoints",
      "teleopExcludingEndgamePoints",
      "endgamePoints",
      "totalScoredCargo",
      "cargoBonusRPILS",
      "hangarBonusRPILS",
      "autoTaxiPoints",
      "autoTaxiRate",
      "autoCargoPoints",
      "autoCargoLower",
      "autoCargoUpper",
      "autoCargoTotal",
      "quintetAchieved",
      "quintetAchievedRate",
      "teleopCargoPoints",
      "teleopCargoLower",
      "teleopCargoUpper",
      "teleopCargoTotal",
      "endgameLowPoints",
      "atLeastLowEndgameRate",
      "endgameMidPoints",
      "atLeastMidEndgameRate",
      "endgameHighPoints",
      "atLeastEndgameHighRate",
      "endgameTraversalPoints",
      "endgameTraversalRate",
      "cargoBonus",
      "cargoBonusCompletionPercentage",
      "cargoBonusContributingCargo",
      "hangarBonus",
      "hangarBonusCompletionPercentage",
      "foulCount",
      "techFoulCount",
      "foulPoints",
      "foulsDrawn",
      "techFoulsDrawn",
      "foulPointsDrawn",
    ] as const
  ).map((key) => ({
    field: key,
    valueGetter: pluckStat(key, 0),
    sortingOrder: SORT_ORDER_DESC_FIRST,
  })),
];

export default function DivisionTab(): JSX.Element {
  const { teams } = useLoaderData<{
    division: Division;
    teams: (Team & { stats: TeamStats | null })[];
  }>();

  return (
    <DataGrid
      columns={COLUMNS}
      rows={teams}
      components={{
        Toolbar: GridToolbar,
      }}
      density="compact"
      initialState={{
        sorting: {
          sortModel: [
            {
              field: "unpenalizedTotalPoints",
              sort: "desc",
            },
          ],
        },
      }}
      autoHeight
      pageSize={100}
      hideFooter={teams.length <= 100}
      getRowId={(team) => team.key}
    />
  );
}
