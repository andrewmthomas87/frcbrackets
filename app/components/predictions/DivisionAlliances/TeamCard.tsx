import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import { useCallback } from "react";
import type { SimpleTeamAndStats } from "~/db.server";

type Props = {
  isDisabled: boolean;
  isCaptain: boolean;
  team: SimpleTeamAndStats | null;
  filteredTeams: SimpleTeamAndStats[];

  onSetTeamKey(teamKey: string | null): void;
};

export default function TeamCard({
  isDisabled,
  isCaptain,
  team,
  filteredTeams,
  onSetTeamKey,
}: Props): JSX.Element {
  const onChange = useCallback(
    (_: any, selected: SimpleTeamAndStats | null) =>
      onSetTeamKey(selected ? selected.key : null),
    [onSetTeamKey]
  );

  return (
    <Box width="15em">
      <Autocomplete
        value={team}
        options={(team ? [team] : []).concat(filteredTeams)}
        disabled={isDisabled}
        size="small"
        fullWidth
        openOnFocus
        autoHighlight
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(team) => `${team.teamNumber} ${team.name}`}
        renderOption={(props, team) => (
          <Box component="li" {...props}>
            <Stack direction="column" spacing={0.25}>
              <Typography variant="body2">
                <b>{team.teamNumber}</b> {team.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography variant="caption">
                  ELO {team.stats.winningMarginElo}
                </Typography>
                <Typography variant="caption">
                  OPR {team.stats.unpenalizedTotalPoints}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            label={isCaptain ? "Captain" : "First pick"}
            helperText={
              team
                ? `ELO ${team.stats.winningMarginElo}, OPR ${team.stats.unpenalizedTotalPoints}`
                : "No team selected"
            }
            {...params}
            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
          />
        )}
        onChange={onChange}
      />
    </Box>
  );
}
