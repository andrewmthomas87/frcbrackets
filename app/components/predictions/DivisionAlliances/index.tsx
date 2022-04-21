import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import type { SimpleTeamAndStats } from "~/db.server";
import type { Alliance, UsePrediction } from "../usePrediction";
import AllianceSelect from "./AllianceSelect";

type Props = {
  isLocked: boolean;
  isDisabled: boolean;
  sortedTeams: SimpleTeamAndStats[];
  alliances: Alliance[];

  lookupTeam: UsePrediction["lookupTeam"];
  setAllianceTeam: UsePrediction["setAllianceTeam"];
};

export default function DivisionAlliances({
  isLocked,
  isDisabled,
  sortedTeams,
  alliances,
  lookupTeam,
  setAllianceTeam,
}: Props): JSX.Element {
  const selectedTeamKeys = useMemo(
    () => new Set(alliances.flat().filter((t): t is string => !!t)),
    [alliances]
  );
  const filteredTeams = useMemo(
    () => sortedTeams.filter((t) => !selectedTeamKeys.has(t.key)),
    [sortedTeams, selectedTeamKeys]
  );

  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Alliances
      </Typography>
      <Typography variant="body1" gutterBottom>
        Predict the alliance captain and first pick of each alliance.
      </Typography>
      <Stack direction="column" spacing={2} py={1} overflow="auto">
        {alliances.map((alliance, index) => (
          <AllianceSelect
            key={index}
            isLocked={isLocked}
            isDisabled={isDisabled}
            n={index + 1}
            alliance={alliance}
            teams={sortedTeams}
            filteredTeams={filteredTeams}
            lookupTeam={lookupTeam}
            setAllianceTeam={setAllianceTeam}
          />
        ))}
      </Stack>
    </Box>
  );
}
