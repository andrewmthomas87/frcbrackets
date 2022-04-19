import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "./Header";

export default function EinsteinScoringStats(): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Header title="Stats" maxScore={80} />
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: theme.breakpoints.values.md }}>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Equation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={
                    <>
                      What will be the <b>Average Alliance Hangar Points</b> of
                      the first seed at the conclusion of the round robin
                      tournament?
                    </>
                  }
                >
                  <Chip size="small" label="Average Alliance Hangar Points" />
                </Tooltip>
              </TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                40 points minus 6 times the difference between your prediction
                and the actual score.
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  max(0, 40-6*abs(round(actual)-prediction))
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={
                    <>
                      What will be the <b>Average Finals Match Score</b> of the
                      winning alliance?
                    </>
                  }
                >
                  <Chip size="small" label="Average Finals Match Score" />
                </Tooltip>
              </TableCell>
              <TableCell align="right">40</TableCell>
              <TableCell>
                40 points minus 2 times the difference between your prediction
                and the actual score.
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  max(0, 40-2*abs(round(actual)-prediction))
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
