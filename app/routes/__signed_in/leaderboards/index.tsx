import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
