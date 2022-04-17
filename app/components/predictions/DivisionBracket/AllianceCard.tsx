import {
  Box,
  Card,
  CardActionArea,
  colors,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import type { Alliance, UsePrediction } from "../usePrediction";

type Props = {
  isDisabled: boolean;
  isRed: boolean;
  alliance: {
    number: number;
    alliance: Alliance;
  };
  isSelected: boolean | null;

  lookupTeam: UsePrediction["lookupTeam"];
  onSelect(): void;
};

export default function AllianceCard({
  isDisabled,
  isRed,
  alliance,
  isSelected,
  lookupTeam,
  onSelect,
}: Props): JSX.Element {
  const bgcolor = isRed ? "rgba(183,28,28,0.5)" : "rgba(13,71,161,0.5)";
  const borderColor = isRed ? colors.red[800] : colors.blue[800];

  const captain = useMemo(() => {
    const key = alliance.alliance[0];
    return key ? lookupTeam(key) : null;
  }, [alliance.alliance, lookupTeam]);
  const firstPick = useMemo(() => {
    const key = alliance.alliance[1];
    return key ? lookupTeam(key) : null;
  }, [alliance.alliance, lookupTeam]);

  return (
    <Card
      color="error"
      variant="outlined"
      sx={{
        width: "7.5em",
        bgcolor: isSelected ? bgcolor : undefined,
        borderColor,
        textAlign: "center",
        opacity:
          (isDisabled ? 0.875 : 1) *
          (isSelected === true ? 1 : isSelected === false ? 0.5 : 1),
      }}
    >
      <CardActionArea disabled={isDisabled} onClick={onSelect}>
        <Box px={1.5} pt={0.5} pb={1}>
          <Typography variant="overline">Alliance {alliance.number}</Typography>
          <Stack display="inline-flex" direction="row" spacing={1}>
            <Typography variant="body2">
              {captain?.teamNumber ?? "TBD"}
            </Typography>
            <Typography variant="body2">
              {firstPick?.teamNumber ?? "TBD"}
            </Typography>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}
