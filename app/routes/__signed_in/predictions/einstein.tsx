import { Divider, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import EinsteinFinals from "~/components/predictions/EinsteinFinals";
import EinsteinRoundRobin from "~/components/predictions/EinsteinRoundRobin.tsx";
import EinsteinStats from "~/components/predictions/EinsteinStats";
import EinsteinSubmit from "~/components/predictions/EinsteinSubmit";
import useEinsteinPrediction from "~/components/predictions/useEinsteinPrediction";
import { prisma } from "~/db.server";

type LoaderDataType = {
  divisions: Division[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const divisions = await prisma.division.findMany();

  return json<LoaderDataType>({ divisions });
};

export default function EinsteinTab(): JSX.Element {
  const { divisions } = useLoaderData<LoaderDataType>();
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
  } = useEinsteinPrediction(divisions);

  const isSubmitting = state === "submitting";

  return (
    <Stack direction="column" spacing={2} divider={<Divider />}>
      <Typography variant="h4" component="h2">
        Einstein Field
      </Typography>
      <EinsteinStats
        isDisabled={isSubmitting}
        averageRRAllianceHangarPoints={averageRRAllianceHangarPoints}
        averageFinalsMatchScore={averageFinalsMatchScore}
        setAverageRRAllianceHangarPoints={setAverageRRAllianceHangarPoints}
        setAverageFinalsMatchScore={setAverageFinalsMatchScore}
      />
      <EinsteinRoundRobin
        isDisabled={isSubmitting}
        results={results}
        lookupDivision={lookupDivision}
        setResult={setResult}
      />
      <EinsteinFinals
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
        isSubmitting={isSubmitting}
        result={actionData}
        prediction={prediction}
      />
    </Stack>
  );
}
