import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledChartWrapper = styled(Box)(({ theme }) => ({
  ".apexcharts-legend-text": {
    color: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-text": {
    fill: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-legend-series": {
    color: `${theme.palette.text.primary} !important`,
  },
  ".apexcharts-legend-marker": {
    marginRight: "8px",
  },

  // Data labels styling
  ".apexcharts-datalabels text": {
    fontSize: "12px",
    fill: `${theme.palette.text.primary} !important`,
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "16px",
    },
  },

  // Tooltip styling
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
