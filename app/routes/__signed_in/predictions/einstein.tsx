import { Divider, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import EinsteinFinals from "~/components/predictions/EinsteinFinals";
import EinsteinRoundRobin from "~/components/predictions/EinsteinRoundRobin.tsx";
import EinsteinStats from "~/components/predictions/EinsteinStats";
import EinsteinSubmit from "~/components/predictions/EinsteinSubmit";
import type { Prediction } from "~/components/predictions/useEinsteinPrediction";
import useEinsteinPrediction from "~/components/predictions/useEinsteinPrediction";
import type { EinsteinPredictionAndDivisions } from "~/db.server";
import {
  divisionKeys,
  einsteinPredictionAndDivisions,
  prisma,
  upsertEinsteinPrediction,
} from "~/db.server";
import { requireUserId } from "~/session.server";
import { arePredictionsLocked } from "~/utils";

function isResults(results: any): results is string[] {
  return (
    Array.isArray(results) &&
    results.filter(
      (divisionKey) => typeof divisionKey === "string" && !!divisionKey
    ).length === 15
  );
}

function isPrediction(data: any): data is Prediction {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const {
    averageRRAllianceHangarPoints,
    averageFinalsMatchScore,
    results,
    firstSeed,
    secondSeed,
    winner,
  } = data;

  if (
    typeof averageRRAllianceHangarPoints !== "number" ||
    averageRRAllianceHangarPoints < 0 ||
    averageRRAllianceHangarPoints > 500
  ) {
    return false;
  }
  if (
    typeof averageFinalsMatchScore !== "number" ||
    averageFinalsMatchScore < 0 ||
    averageFinalsMatchScore > 500
  ) {
    return false;
  }

  if (!isResults(results)) {
    return false;
  }

  if (
    !(
      typeof firstSeed === "string" &&
      firstSeed &&
      typeof secondSeed === "string" &&
      secondSeed &&
      typeof winner === "string" &&
      winner
    )
  ) {
    return false;
  }

  return true;
}

export const action: ActionFunction = async ({ request, params }) => {
  const isLocked = arePredictionsLocked();
  if (isLocked) {
    return json({ error: "Predictions are locked" });
  }

  const formData = await request.formData();
  const prediction: any = JSON.parse(
    (formData.get("prediction") as string | null) || ""
  );
  if (!isPrediction(prediction)) {
    return json({ error: "Invalid predictions" });
  }

  const validDivisionKeys = new Set(
    (await divisionKeys()).map((division) => division.key)
  );
  const invalidIndex = prediction.results.findIndex(
    (divisionKey) => !validDivisionKeys.has(divisionKey)
  );
  if (invalidIndex > -1) {
    return json({ error: "Invalid predictions" });
  }

  if (
    !(
      validDivisionKeys.has(prediction.firstSeed) &&
      validDivisionKeys.has(prediction.secondSeed) &&
      validDivisionKeys.has(prediction.winner)
    )
  ) {
    return json({ error: "Invalid predictions" });
  } else if (
    !(
      prediction.winner === prediction.firstSeed ||
      prediction.winner === prediction.secondSeed
    )
  ) {
    return json({ error: "Invalid predictions" });
  }

  const userID = await requireUserId(request);
  await upsertEinsteinPrediction(
    userID,
    prediction.averageRRAllianceHangarPoints,
    prediction.averageFinalsMatchScore,
    prediction.results,
    prediction.firstSeed,
    prediction.secondSeed,
    prediction.winner
  );

  return json({});
};

type LoaderDataType = {
  isLocked: boolean;
  divisions: Division[];
  prediction: EinsteinPredictionAndDivisions | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const isLocked = arePredictionsLocked();

  const divisions = await prisma.division.findMany();

  const userID = await requireUserId(request);
  const prediction = await einsteinPredictionAndDivisions(userID);

  return json<LoaderDataType>({ isLocked, divisions, prediction });
};

export default function EinsteinTab(): JSX.Element {
  const {
    isLocked,
    divisions,
    prediction: initialPrediction,
  } = useLoaderData<LoaderDataType>();
  const actionData = useActionData<{ error?: string }>();
  const { state } = useTransition();

  const {
    averageRRAllianceHangarPoints,
    averageFinalsMatchScore,
    results,
    firstSeed,
    secondSeed,
    winner,
    prediction,
    lookupDivision,
    setResult,
    setAverageRRAllianceHangarPoints,
    setAverageFinalsMatchScore,
    setFirstSeed,
    setSecondSeed,
    setWinner,
  } = useEinsteinPrediction(divisions, initialPrediction);

  const isSubmitting = state === "submitting";

  return (
    <Stack direction="column" spacing={2} divider={<Divider />}>
      <Typography variant="h4" component="h2">
        Einstein Field
      </Typography>
      <EinsteinStats
        isLocked={isLocked}
        isDisabled={isSubmitting}
        averageRRAllianceHangarPoints={averageRRAllianceHangarPoints}
        averageFinalsMatchScore={averageFinalsMatchScore}
        setAverageRRAllianceHangarPoints={setAverageRRAllianceHangarPoints}
        setAverageFinalsMatchScore={setAverageFinalsMatchScore}
      />
      <EinsteinRoundRobin
        isLocked={isLocked}
        isDisabled={isSubmitting}
        results={results}
        lookupDivision={lookupDivision}
        setResult={setResult}
      />
      <EinsteinFinals
        isLocked={isLocked}
        isDisabled={isSubmitting}
        divisions={divisions}
        results={results}
        firstSeed={firstSeed}
        secondSeed={secondSeed}
        winner={winner}
        lookupDivision={lookupDivision}
        setFirstSeed={setFirstSeed}
        setSecondSeed={setSecondSeed}
        setWinner={setWinner}
      />
      <EinsteinSubmit
        isLocked={isLocked}
        isSubmitting={isSubmitting}
        result={actionData}
        prediction={prediction}
      />
    </Stack>
  );
}
