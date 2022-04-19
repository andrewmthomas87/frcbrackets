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
              <TableCell>Semifinalists</TableCell>
              <TableCell align="right">80</TableCell>
              <TableCell>
                10 points per team you accurately predicted to progress to at
                least the semifinals.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finalists</TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                10 points per team you accurately predicted to progress to the
                finals.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Division Winners</TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                20 points per team you accurately predicted as a division
                winner.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
