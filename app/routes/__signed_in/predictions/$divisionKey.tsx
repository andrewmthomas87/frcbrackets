import { Divider, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import DivisionAlliances from "~/components/predictions/DivisionAlliances";
import DivisionBracket from "~/components/predictions/DivisionBracket";
import DivisionStats from "~/components/predictions/DivisionStats";
import DivisionSubmit from "~/components/predictions/DivisionSubmit";
import usePredictions from "~/components/predictions/usePredictions";
import type { SimpleTeamAndStats } from "~/db.server";
import {
  prisma,
  simpleTeamsAndStatsByDivision,
  teamKeysOnlyByDivision,
} from "~/db.server";

type PredictionsData = {
  averageQualificationMatchScore: number;
  averagePlayoffMatchScore: number;
  alliances: [string, string][];
  results: number[];
};

function isAlliances(alliances: any): alliances is [string, string][] {
  return (
    Array.isArray(alliances) &&
    alliances.filter(
      (alliance) =>
        typeof alliance[0] === "string" && typeof alliance[1] === "string"
    ).length === 8
  );
}

function isResults(results: any): results is number[] {
  return (
    Array.isArray(results) &&
    results.filter(
      (alliance) =>
        typeof alliance === "number" && alliance >= 1 && alliance <= 8
    ).length === 7
  );
}

function isPredictionsData(data: any): data is PredictionsData {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const {
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
    results,
  } = data;

  if (
    typeof averageQualificationMatchScore !== "number" ||
    averageQualificationMatchScore < 0 ||
    averageQualificationMatchScore > 500
  ) {
    return false;
  }
  if (
    typeof averagePlayoffMatchScore !== "number" ||
    averagePlayoffMatchScore < 0 ||
    averagePlayoffMatchScore > 500
  ) {
    return false;
  }

  if (!isAlliances(alliances)) {
    return false;
  }

  if (!isResults(results)) {
    return false;
  }

  return true;
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const predictions: any = JSON.parse(
    (formData.get("predictions") as string | null) || ""
  );
  if (!isPredictionsData(predictions)) {
    return json({ error: "Invalid predictions" });
  }

  const divisionKey = params["divisionKey"]!;
  const validTeamKeys = new Set(
    (await teamKeysOnlyByDivision(divisionKey)).map((team) => team.key)
  );
  const invalidIndex = predictions.alliances
    .flat()
    .findIndex((teamKey) => !validTeamKeys.has(teamKey));
  if (invalidIndex > -1) {
    return json({ error: "Invalid predictions" });
  }

  // Ensure unique
  const teamKeysSet = new Set(predictions.alliances.flat());
  if (teamKeysSet.size !== 16) {
    return json({ error: "Invalid predictions" });
  }

  return json({});
};

type LoaderDataType = {
  division: Division;
  teams: SimpleTeamAndStats[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const divisionKey = params["divisionKey"]!;

  const division = await prisma.division.findUnique({
    where: { key: divisionKey },
  });
  if (!division) {
    throw redirect("./");
  }

  const teams = await simpleTeamsAndStatsByDivision(division.key);

  return json<LoaderDataType>({ division, teams });
};

export default function DivisionTab(): JSX.Element {
  const { division, teams } = useLoaderData<LoaderDataType>();
  const actionData = useActionData<{ error?: string }>();
  const { state } = useTransition();

  const {
    sortedTeams,
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
    results,
    predictions,
    lookupTeam,
    setAverageQualificationMatchScore,
    setAveragePlayoffMatchScore,
    setAllianceTeam,
    setResult,
  } = usePredictions(teams);

  const isSubmitting = state === "submitting";

  return (
    <Stack direction="column" spacing={2} divider={<Divider />}>
      <Typography variant="h4" component="h2">
        {division.name}
      </Typography>
      <DivisionStats
        isDisabled={isSubmitting}
        averageQualificationMatchScore={averageQualificationMatchScore}
        averagePlayoffMatchScore={averagePlayoffMatchScore}
        setAverageQualificationMatchScore={setAverageQualificationMatchScore}
        setAveragePlayoffMatchScore={setAveragePlayoffMatchScore}
      />
      <DivisionAlliances
        isDisabled={isSubmitting}
        sortedTeams={sortedTeams}
        alliances={alliances}
        lookupTeam={lookupTeam}
        setAllianceTeam={setAllianceTeam}
      />
      <DivisionBracket
        isDisabled={isSubmitting}
        alliances={alliances}
        results={results}
        lookupTeam={lookupTeam}
        setResult={setResult}
      />
      <DivisionSubmit
        isSubmitting={isSubmitting}
        result={actionData}
        predictions={predictions}
      />
    </Stack>
  );
}
