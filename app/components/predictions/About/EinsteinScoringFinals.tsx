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

export default function EinsteinScoringFinals(): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Header title="Finals" maxScore={200} />
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: theme.breakpoints.values.sm }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Finalists</TableCell>
              <TableCell align="right">100</TableCell>
              <TableCell>
                For each finalist, 50 points for predicting the correct division
                and seed, 30 points for the correct division but wrong seed.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Winner</TableCell>
              <TableCell align="right">100</TableCell>
              <TableCell>
                100 points for predicting the correct winning division.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
