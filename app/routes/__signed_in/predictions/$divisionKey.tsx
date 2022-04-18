import { Divider, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import DivisionAlliances from "~/components/predictions/DivisionAlliances";
import DivisionBracket from "~/components/predictions/DivisionBracket";
import DivisionStats from "~/components/predictions/DivisionStats";
import DivisionSubmit from "~/components/predictions/DivisionSubmit";
import type { Prediction } from "~/components/predictions/usePrediction";
import usePrediction from "~/components/predictions/usePrediction";
import type {
  DivisionPredictionAndAlliances,
  SimpleTeamAndStats,
} from "~/db.server";
import {
  divisionPredictionAndAlliances,
  prisma,
  simpleTeamsAndStatsByDivision,
  teamKeysOnlyByDivision,
  upsertDivisionPrediction,
} from "~/db.server";
import { requireUserId } from "~/session.server";

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

function isPrediction(data: any): data is Prediction {
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
  const prediction: any = JSON.parse(
    (formData.get("prediction") as string | null) || ""
  );
  if (!isPrediction(prediction)) {
    return json({ error: "Invalid predictions" });
  }

  const divisionKey = params["divisionKey"]!;
  const validTeamKeys = new Set(
    (await teamKeysOnlyByDivision(divisionKey)).map((team) => team.key)
  );
  const invalidIndex = prediction.alliances
    .flat()
    .findIndex((teamKey) => !validTeamKeys.has(teamKey));
  if (invalidIndex > -1) {
    return json({ error: "Invalid predictions" });
  }

  // Ensure unique
  const teamKeysSet = new Set(prediction.alliances.flat());
  if (teamKeysSet.size !== 16) {
    return json({ error: "Invalid predictions" });
  }

  const userID = await requireUserId(request);
  await upsertDivisionPrediction(
    userID,
    divisionKey,
    prediction.averageQualificationMatchScore,
    prediction.averagePlayoffMatchScore,
    prediction.alliances,
    prediction.results
  );

  return json({});
};

type LoaderDataType = {
  division: Division;
  teams: SimpleTeamAndStats[];
  prediction: DivisionPredictionAndAlliances | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const divisionKey = params["divisionKey"]!;
  const division = await prisma.division.findUnique({
    where: { key: divisionKey },
  });
  if (!division) {
    throw redirect("./");
  }

  const teams = await simpleTeamsAndStatsByDivision(division.key);

  const userID = await requireUserId(request);
  const prediction = await divisionPredictionAndAlliances(userID, division.key);

  return json<LoaderDataType>({ division, teams, prediction });
};

export default function DivisionTab(): JSX.Element {
  const {
    division,
    teams,
    prediction: initialPrediction,
  } = useLoaderData<LoaderDataType>();
  const actionData = useActionData<{ error?: string }>();
  const { state } = useTransition();

  const {
    sortedTeams,
    averageQualificationMatchScore,
    averagePlayoffMatchScore,
    alliances,
    results,
    prediction,
    lookupTeam,
    setAverageQualificationMatchScore,
    setAveragePlayoffMatchScore,
    setAllianceTeam,
    setResult,
  } = usePrediction(teams, initialPrediction);

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
        prediction={prediction}
      />
    </Stack>
  );
}
