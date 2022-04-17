import { TextField } from "@mui/material";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  value: number;
  isDisabled: boolean;

  onSetValue(value: number): void;
};

export default function MatchScoreInput({
  value,
  isDisabled,

  onSetValue,
}: Props): JSX.Element {
  const [valueStr, setValueStr] = useState(
    isNaN(value) ? "" : value.toString()
  );
  const [hasBlurred, setHasBlurred] = useState(false);

  useEffect(() => {
    if (!isNaN(value)) {
      setValueStr(value.toString());
    }
  }, [value]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setValueStr(event.currentTarget.value),
    []
  );
  const onBlur = useCallback(() => {
    setHasBlurred(true);

    const n = parseInt(valueStr);
    if (!(isNaN(n) || n < 0 || n > 500)) {
      onSetValue(parseInt(valueStr));
    } else {
      onSetValue(NaN);
    }
  }, [valueStr, onSetValue]);

  const isErrored = hasBlurred && (isNaN(value) || value < 0);

  return (
    <TextField
      size="small"
      label="Match Score"
      inputMode="numeric"
      value={valueStr}
      disabled={isDisabled}
      error={isErrored}
      helperText={isErrored ? "Must be a positive number" : undefined}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
