import React from "react";
import { Box, useTheme } from "@mui/material";
import { formatTime } from "../utils/format";

interface ShiftLabelProps {
  shiftMinutes: number;
  workedMinutes: number;
}

const ShiftLabel: React.FC<ShiftLabelProps> = ({
  shiftMinutes,
  workedMinutes,
}) => {
  const theme = useTheme();
  const percentage = (workedMinutes / shiftMinutes) * 100;
  let backgroundColor: string;

  if (percentage >= 75) {
    backgroundColor =
      theme.palette.mode === "light" ? "#C5FFD1" : "rgba(49, 117, 116, 1)";
  } else if (percentage >= 50) {
    backgroundColor =
      theme.palette.mode === "light" ? "#FFE0B2" : "rgba(212, 155, 84, 1)";
  } else {
    backgroundColor = theme.palette.mode === "light" ? "#FFCDD2" : "#FF9C9C";
  }

  return (
    <Box
      px={0.7}
      py={0.2}
      color={theme.palette.mode === "light" ? "common.black" : "common.white"}
      bgcolor={backgroundColor}
      display="inline-flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={1}
    >
      {formatTime(workedMinutes)}
    </Box>
  );
};

export default ShiftLabel;
