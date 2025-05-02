import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledChartWrapper = styled(Box)(({ theme }) => ({
  ".apexcharts-legend-text": {
    color: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-text": {
    fill: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
    fontSize: 9,
    color: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-legend-marker": {
    marginRight: "3px",
  },
  ".apexcharts-datalabels text": {
    [theme.breakpoints.down("sm")]: {
      fontSize: "8px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "16px",
    },
  },
  ".apexcharts-tooltip": {
    backgroundColor: `${theme.palette.background.paper} !important`,
    border: `1px solid ${theme.palette.divider} !important`,
    boxShadow: theme.shadows[3],
  },
  ".apexcharts-tooltip-title": {
    backgroundColor: `${theme.palette.background.default} !important`,
    borderBottom: `1px solid ${theme.palette.divider} !important`,
    color: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-tooltip-text-y-label, .apexcharts-tooltip-text-y-value": {
    color: `${theme.palette.text.primary} !important`,
  },
}));
