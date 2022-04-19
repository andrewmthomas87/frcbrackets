import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "./Header";

export default function DivisionScoringAlliances(): JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Header title="Alliances" maxScore={160} />
      <Typography variant="body1" gutterBottom>
        Each alliance captain and first pick is assigned an index 1-16:
      </Typography>
      <TableContainer component={Paper} sx={{ width: "15em", mb: 2 }}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                1<sup>st</sup> alliance captain
              </TableCell>
              <TableCell align="right">1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                1<sup>st</sup> alliance first pick
              </TableCell>
              <TableCell align="right">2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>...</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                8<sup>th</sup> alliance captain
              </TableCell>
              <TableCell align="right">15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                8<sup>th</sup> alliance first pick
              </TableCell>
              <TableCell align="right">16</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body1" gutterBottom>
        The following points are generated for each captain and first pick of
        the actual alliances:
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: theme.breakpoints.values.md }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Equation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Difference</TableCell>
              <TableCell align="right">7</TableCell>
              <TableCell>
                7 points minus the difference in index between your prediction
                and the actual index. 0 points if you did not select this team.
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  if exists predictionIndex[team]: max(0,
                  7-abs(actualIndex[team]-predictionIndex[team]))
                  <br />
                  else: 0
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Alliance captain, first pick</TableCell>
              <TableCell align="right">3</TableCell>
              <TableCell>
                3 points for each exactly correct placement (alliance # &
                captain vs first pick), 2 points for each partially correct
                placement (correct alliance #, incorrect captain vs first pick),
                otherwise, 0 points
              </TableCell>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace">
                  if predictionIndex[team] == actualIndex[team]: 3<br />
                  else if (predictionIndex[team]-1)%2 ==
                  (actualIndex[team]-1)%2: 2<br />
                  else: 0
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
