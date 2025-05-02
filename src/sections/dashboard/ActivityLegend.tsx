import { Box, Stack, Typography } from "@mui/material";

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" alignItems="center" gap={0.5}>
    <Box
      sx={{
        width: 8,
        height: 8,
        background: color,
        borderRadius: "50%",
      }}
    />
    <Typography
      sx={{
        color: "text.dark",
        fontSize: 10,
        fontFamily: "Sora",
        fontWeight: 400,
        wordWrap: "break-word",
      }}
    >
      {label}
    </Typography>
  </Stack>
);

const AssignedShiftLegend = () => (
  <Stack direction="row" alignItems="center" gap={0.5}>
    <Box
      sx={{
        width: 11,
        height: 7,
        border: "1px solid #039BE5",
      }}
    />
    <Typography
      sx={{
        color: "text.dark",
        fontSize: 10,
        fontFamily: "Sora",
        fontWeight: 400,
        wordWrap: "break-word",
      }}
    >
      Assigned Shift
    </Typography>
  </Stack>
);

interface ActivityLegendProps {
  legends: {
    color: string;
    label: string;
  }[];
}

const ActivityLegend = ({ legends }: ActivityLegendProps) => (
  <Stack direction="row" alignItems="center" gap={1}>
    {legends.map((legend, index) => (
      <LegendItem key={index} color={legend.color} label={legend.label} />
    ))}
    <AssignedShiftLegend />
  </Stack>
);

export default ActivityLegend;
