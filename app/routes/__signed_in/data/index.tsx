import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { metrics } from "~/components/metrics";

export default function AboutTab(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <Typography variant="body1" gutterBottom>
        What follows are brief descriptions of each metric provided by Caleb
        Sykes.
      </Typography>
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
                <span style={{ color: theme.palette.primary.main }}>{key}</span>
              </TableCell>
              <TableCell>{metric.description}</TableCell>
              <TableCell>{metric.includes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
