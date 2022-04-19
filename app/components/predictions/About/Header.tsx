import { Box, Chip, Typography } from "@mui/material";

type Props = {
  title: string;
  maxScore: number;
};

export default function Header({ title, maxScore }: Props): JSX.Element {
  return (
    <Typography variant="h6" component="h3" gutterBottom>
      <Box component="span" mr={1}>
        {title}
      </Box>
      <Chip variant="outlined" size="small" label={`${maxScore} points`} />
    </Typography>
  );
}
