import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { metrics } from "~/components/metrics";

export default function AboutTab(): JSX.Element {
  return (
    <>
      <Typography variant="body1" gutterBottom>
        What follows are brief descriptions of each metric provided by Caleb
        Sykes.
      </Typography>
      <Box overflow="auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Metric</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Includes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(metrics).map(([key, metric]) => (
              <TableRow key={key}>
                <TableCell align="right">
                  <b>{key}</b>
                </TableCell>
                <TableCell>{metric.description}</TableCell>
                <TableCell>
                  <i>{metric.includes}</i>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
