import type { SelectChangeEvent } from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import type { Division } from "@prisma/client";
import { useCallback } from "react";

type Props = {
  isDisabled: boolean;
  label: string;
  division: Division | null;
  divisions: Division[];
  championshipPoints: Record<string, number>;

  onSetDivisionKey(divisionKey: string | null): void;
};

export default function DivisionSelect({
  isDisabled,
  label,
  division,
  divisions,
  championshipPoints,
  onSetDivisionKey,
}: Props): JSX.Element {
  const onChange = useCallback(
    (event: SelectChangeEvent<string>) => onSetDivisionKey(event.target.value),
    [onSetDivisionKey]
  );

  return (
    <FormControl size="small" disabled={isDisabled} sx={{ width: "15em" }}>
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        id={`${label}-select`}
        value={division?.key}
        label={label}
        disabled={isDisabled}
        onChange={onChange}
      >
        {divisions.map((division) => (
          <MenuItem key={division.key} value={division.key}>
            <Stack width={1} direction="row">
              <Typography variant="body1">{division.name}</Typography>
              <Box flexGrow={1} />
              <Typography variant="body2">
                {championshipPoints[division.key]} CS
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
