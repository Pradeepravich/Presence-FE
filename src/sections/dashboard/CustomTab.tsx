import { Box, Stack, Typography, useTheme } from "@mui/material";

interface CustomTabProps {
  activeTab: "working" | "idle";
  setActiveTab: (tab: "working" | "idle") => void;
  workingModeTotal: number;
  idleModeTotal: number;
}

const CustomTab = ({
  activeTab,
  setActiveTab,
  workingModeTotal,
  idleModeTotal,
}: CustomTabProps) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      sx={{
        p: "4px",
        background: theme.palette.mode === "dark" ? "#414141" : "#EEEEEE",
        borderRadius: 1,
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Working Mode Tab */}
      <Box
        onClick={() => setActiveTab("working")}
        sx={{
          px: 2,
          py: 1,
          background:
            activeTab === "working"
              ? theme.palette.mode === "dark"
                ? "#555555"
                : "white"
              : theme.palette.mode === "dark"
              ? "#414141"
              : "#EEEEEE",
          boxShadow:
            activeTab === "working"
              ? "0px 1px 2px rgba(0, 0, 0, 0.25)"
              : "none",
          borderRadius: 1,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
            fontSize: 10,
            wordWrap: "break-word",
          }}
        >
          Working Mode ({workingModeTotal})
        </Typography>
      </Box>

      {/* Idle Mode Tab */}
      <Box
        onClick={() => setActiveTab("idle")}
        sx={{
          px: 2,
          py: 1,
          background:
            activeTab === "idle"
              ? theme.palette.mode === "dark"
                ? "#555555"
                : "white"
              : theme.palette.mode === "dark"
              ? "#414141"
              : "#EEEEEE",
          boxShadow:
            activeTab === "idle" ? "0px 1px 2px rgba(0, 0, 0, 0.25)" : "none",
          borderRadius: 1,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.common.black,
            fontSize: 10,
          }}
        >
          Idle Mode ({idleModeTotal})
        </Typography>
      </Box>
    </Stack>
  );
};

export default CustomTab;
