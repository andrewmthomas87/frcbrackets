import { Box, Chip, Stack, Typography } from "@mui/material";
import type { Alliance, UsePrediction } from "../usePrediction";
import Matchup from "./Matchup";

type Props = {
  isLocked: boolean;
  isDisabled: boolean;
  alliances: Alliance[];
  results: number[];

  lookupTeam: UsePrediction["lookupTeam"];
  setResult: UsePrediction["setResult"];
};

export default function DivisionBracket({
  isLocked,
  isDisabled,
  alliances,
  results,
  lookupTeam,
  setResult,
}: Props): JSX.Element {
  const quarterfinals: [number, number][] = [
    [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
  ];

  const qfs = results.slice(0, 4);
  const sfs = results.slice(4, 6);
  const f = results[6];

  const shouldShowSemis = !!(qfs[0] && qfs[1] && qfs[2] && qfs[3]);
  const shouldShowFinals = !!(sfs[0] && sfs[1]);

  return (
    <Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Bracket
      </Typography>
      <Typography variant="body1" gutterBottom>
        Predict how the alliances you chose will fare in playoffs.
      </Typography>
      <Stack direction="column" spacing={3} py={1}>
        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          overflow="auto"
        >
          <Chip variant="outlined" label="Quarterfinals" />
          {quarterfinals.map(([red, blue], index) => (
            <Matchup
              key={index}
              isLocked={isLocked}
              isDisabled={isDisabled}
              n={index + 1}
              red={{
                number: red,
                alliance: alliances[red - 1],
              }}
              blue={{
                number: blue,
                alliance: alliances[blue - 1],
              }}
              selected={qfs[index]}
              lookupTeam={lookupTeam}
              onSelect={(alliance) => setResult(index, alliance)}
            />
          ))}
        </Stack>
        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          overflow="auto"
        >
          <Chip variant="outlined" label="Semifinals" />
          {shouldShowSemis ? (
            [0, 0].map((_, index) => (
              <Matchup
                key={index + 1}
                isLocked={isLocked}
                isDisabled={isDisabled}
                n={index + 1}
                red={{
                  number: qfs[index],
                  alliance: alliances[qfs[index] - 1],
                }}
                blue={{
                  number: qfs[3 - index],
                  alliance: alliances[qfs[3 - index] - 1],
                }}
                selected={sfs[index]}
                lookupTeam={lookupTeam}
                onSelect={(alliance) => setResult(4 + index, alliance)}
              />
            ))
          ) : (
            <Typography variant="body2">Quarterfinals unfinished</Typography>
          )}
        </Stack>
        <Stack
          direction="column"
          spacing={2}
          alignItems="flex-start"
          overflow="auto"
        >
          <Chip variant="outlined" label="Final" />
          {shouldShowFinals ? (
            <Matchup
              isLocked={isLocked}
              isDisabled={isDisabled}
              n={1}
              red={{
                number: sfs[0],
                alliance: alliances[sfs[0] - 1],
              }}
              blue={{
                number: sfs[1],
                alliance: alliances[sfs[1] - 1],
              }}
              selected={f}
              lookupTeam={lookupTeam}
              onSelect={(alliance) => setResult(6, alliance)}
            />
          ) : (
            <Typography variant="body2">Semifinals unfinished</Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
