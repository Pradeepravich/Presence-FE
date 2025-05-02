import { useTheme } from "@mui/material";

const useBgColor = (backgroundColor?: string) => {
  const theme = useTheme();
  const bgColor =
    theme.palette.mode === "light" ? backgroundColor || "#eeeeee" : "#000000";

  return { bgColor };
};
export default useBgColor;
