import React from "react";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import teamsLogo from "../../assets/teams-logo.svg";
import Dropdown from "../../components/design-system/Dropdown";
import ScrollableTabs from "../../components/design-system/ScrollableTabs";

const EmployeeHeader: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <Stack
      component={isSmallScreen ? ScrollableTabs : "div"}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        height: 54,
        px: 2,
        backgroundColor: theme.palette.mode === "light" ? "#ebeff2" : "#21282e",
      }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Dropdown
          options={[{ label: "MS Teams", value: "teams" }]}
          value="teams"
          onChange={() => ""}
          renderValue={() => (
            <Stack direction="row" gap={1.5} alignItems="center" sx={{ ml: 1 }}>
              <img src={teamsLogo} alt="teams" style={{ height: 24 }} />
              <Typography variant="h2">MS Teams</Typography>
            </Stack>
          )}
          testId="dashboard-teams-network-dropdown"
          forceBackgroundColor="transparent"
        />
      </Stack>
    </Stack>
  );
};

export default EmployeeHeader;
