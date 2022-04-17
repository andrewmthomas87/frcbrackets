import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import type { SimpleTeamAndStats } from "~/db.server";
import type { UsePredictions } from "../usePredictions";
import TeamCard from "./TeamCard";

type Props = {
  isDisabled: boolean;
  n: number;
  alliance: [string | null, string | null];
  teams: SimpleTeamAndStats[];
  filteredTeams: SimpleTeamAndStats[];

  lookupTeam: UsePredictions["lookupTeam"];
  setAllianceTeam: UsePredictions["setAllianceTeam"];
};

export default function AllianceSelect({
  isDisabled,
  n,
  alliance,
  filteredTeams,
  lookupTeam,
  setAllianceTeam,
}: Props): JSX.Element {
  const onSetCaptain = useCallback(
    (teamKey: string | null) => setAllianceTeam(n, true, teamKey),
    [n, setAllianceTeam]
  );
  const onSetFirstPick = useCallback(
    (teamKey: string | null) => setAllianceTeam(n, false, teamKey),
    [n, setAllianceTeam]
  );

  return (
    <Stack direction="row" spacing={3}>
      <Typography variant="subtitle1" fontWeight="bold">
        {n}.
      </Typography>
      <Stack direction="row" spacing={2}>
        <TeamCard
          isDisabled={isDisabled}
          isCaptain={true}
          team={alliance[0] ? lookupTeam(alliance[0]) : null}
          filteredTeams={filteredTeams}
          onSetTeamKey={onSetCaptain}
        />
        <TeamCard
          isDisabled={isDisabled}
          isCaptain={false}
          team={alliance[1] ? lookupTeam(alliance[1]) : null}
          filteredTeams={filteredTeams}
          onSetTeamKey={onSetFirstPick}
        />
      </Stack>
    </Stack>
  );
}
