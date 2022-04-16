import { Box, Divider, Stack, Typography } from "@mui/material";
import type { Division } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const divisionKey = params["divisionKey"]!;

  const division = await prisma.division.findUnique({
    where: { key: divisionKey },
  });
  if (!division) {
    throw redirect("./");
  }

  const teams = await prisma.team.findMany({
    where: {
      division: {
        key: division.key,
      },
    },
    include: {
      stats: {
        select: {
          winningMarginElo: true,
          unpenalizedTotalPoints: true,
        },
      },
    },
  });

  return json({ division, teams });
};

export default function DivisionTab(): JSX.Element {
  const { division } = useLoaderData<{ division: Division }>();

  return (
    <Stack direction="column" spacing={2} divider={<Divider />}>
      <Typography variant="h4" component="h2">
        {division.name}
      </Typography>
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Stats
        </Typography>
        <Typography variant="body1" gutterBottom>
          Predict miscellaneous stats.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Alliances
        </Typography>
        <Typography variant="body1" gutterBottom>
          Predict the alliance captain and first pick of each alliance.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" component="h3" gutterBottom>
          Bracket
        </Typography>
        <Typography variant="body1" gutterBottom>
          Predict how your alliances will fare in playoffs.
        </Typography>
      </Box>
    </Stack>
  );
}
