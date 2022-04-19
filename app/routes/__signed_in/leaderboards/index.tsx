import { Alert } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import Page from "~/components/Page";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async () => {
  const division = await prisma.division.findFirst({
    select: {
      key: true,
    },
  });
  if (!division) {
    throw new Error("Expected divisions");
  }

  return redirect(`/leaderboards/${division.key}`);
};

export default function Redirecting(): JSX.Element {
  return (
    <Page maxWidth="lg">
      <Alert variant="outlined" severity="info">
        Redirecting...
      </Alert>
    </Page>
  );
}
