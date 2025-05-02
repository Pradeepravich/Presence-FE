import { styled, Typography, useTheme } from "@mui/material";
import { FC } from "react";
import Tooltip from "./Tooltip";

const HourSpanTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  padding: "10px",
  width: 24,
  height: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  color: theme.palette.mode === "dark" ? theme.palette.common.black : undefined,
}));

const getBgColor = (value: number, isLightMode: boolean) => {
  if (value === 0) return isLightMode ? "#EEEEEE" : "rgba(47, 47, 56, 1)";
  if (value <= 30) return isLightMode ? "#FFCDD2": "rgba(255, 156, 156, 1)";
  if (value > 30 && value <= 45) return isLightMode ?  "#FFE0B2" : "rgba(212, 155, 84, 1)";
  if (value > 45 && value <= 60) return  isLightMode ? "#C5FFD1" : "rgba(49, 117, 116, 1)";
};

interface MinutesAvatarProps {
  value: number;
  title?: string;
}

const MinutesAvatar: FC<MinutesAvatarProps> = ({ value, title }) => {
  const theme = useTheme();
  return (
    <Tooltip title={title} enterDelay={1000} enterNextDelay={1000}>
      <HourSpanTypography
        variant="caption"
        bgcolor={getBgColor(value, theme.palette.mode === "light")}
        sx={{color: theme.palette.mode === 'light' ? "black" : "white"}}
      >
        {value}
      </HourSpanTypography>
    </Tooltip>
  );
};

export default MinutesAvatar;
