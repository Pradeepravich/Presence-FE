import { Box, useTheme } from "@mui/material";

export const StatusLabel = ({ status }: { status: string }) => {
  const theme = useTheme();
  const getStatusColor = (): string => {
    if (!status) {
      return "";
    }

    const lowerStatus = status.toLowerCase();

    if (status === "Week Off") {
      return theme.palette.mode === "light" ? "#000000" : "#000";
    } else if (lowerStatus.includes("holiday")) {
      return theme.palette.mode === "light" ? "#028AF6" : "#3282B8";
    } else if (status === "Out Of Office") {
      return "#EC5151";
    } else {
      return "";
    }
  };

  return (
    <Box
      sx={{
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 0.5,
        paddingBottom: 0.25,
        background: getStatusColor(),
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        display: "inline-flex",
        borderRadius: 1,
        color: "#ECEFF1",
        fontSize: 10,
        textWrap: "nowrap",
      }}
    >
      {status}
    </Box>
  );
};
