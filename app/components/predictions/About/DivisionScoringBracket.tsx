import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import Header from "./Header";

export default function DivisionScoringBracket(): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Header title="Bracket" maxScore={160} />
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: theme.breakpoints.values.sm }}>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Semifinals</TableCell>
              <TableCell align="right">80</TableCell>
              <TableCell>
                For each team that progresses to at least the semifinals, 10
                points if you predicted that team to progress to at least the
                semifinals.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finals</TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                For each team that progresses to the finals, 10 points if you
                predicted that team to progress to the finals.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Winners</TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                For each team that wins, 20 points if you predicted that team to
                win.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
