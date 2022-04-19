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

export default function DivisionScoringStats(): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Header title="Stats" maxScore={40} />
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
                      What will be the <b>Average Qualification Match Score</b>{" "}
                      of the first seed?
                    </>
                  }
                >
                  <Chip
                    size="small"
                    label="Average Qualification Match Score"
                  />
                </Tooltip>
              </TableCell>
              <TableCell align="right">20</TableCell>
              <TableCell>
                20 minus the distance between your prediction and the actual
                score.
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  max(0, 20-abs(round(actual)-prediction))
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={
                    <>
                      What will be the <b>Average Playoff Match Score</b> of the
                      winning alliance?
                    </>
                  }
                >
                  <Chip size="small" label="Average Playoff Match Score" />
                </Tooltip>
              </TableCell>
              <TableCell align="right">20</TableCell>
              <TableCell>
                20 minus the distance between your prediction and the actual
                score.
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  max(0, 20-abs(round(actual)-prediction))
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
