import { Card, CardActionArea, colors, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import type { UseEinsteinPrediction } from "./useEinsteinPrediction";

type Props = {
  isDisabled: boolean;
  isRed: boolean;
  divisionKey: string;
  isSelected: boolean | null;

  lookupDivision: UseEinsteinPrediction["lookupDivision"];
  onSelect(): void;
};

export default function DivisionCard({
  isDisabled,
  isRed,
  divisionKey,
  isSelected,
  lookupDivision,
  onSelect,
}: Props): JSX.Element {
  const bgcolor = isRed ? "rgba(183,28,28,0.5)" : "rgba(13,71,161,0.5)";
  const borderColor = isRed ? colors.red[800] : colors.blue[800];

  const division = useMemo(
    () => lookupDivision(divisionKey),
    [divisionKey, lookupDivision]
  );

  return (
    <Card
      color="error"
      variant="outlined"
      sx={{
        width: "5em",
        bgcolor: isSelected ? bgcolor : undefined,
        borderColor,
        textAlign: "center",
        opacity:
          (isDisabled ? 0.875 : 1) *
          (isSelected === true ? 1 : isSelected === false ? 0.5 : 1),
      }}
    >
      <CardActionArea disabled={isDisabled} onClick={onSelect}>
        <Box px={1.5} py={1}>
          <Typography variant="body2">{division.name.split(" ")[0]}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
