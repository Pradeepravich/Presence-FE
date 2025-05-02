import { styled, tooltipClasses, TooltipProps } from "@mui/material";
import { Tooltip as MuiTooltip } from "@mui/material";

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: "0px 0px 14px 0px #00000040",
    fontSize: "9px",
    padding: "10px",
  },
}));

export default Tooltip;
