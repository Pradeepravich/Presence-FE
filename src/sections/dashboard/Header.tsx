import React, { useState } from "react";
import {
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import teamsLogo from "../../assets/teams-logo.svg";
import Dropdown from "../../components/design-system/Dropdown";
import LiveLabel from "../../components/design-system/LiveLabel";
import useCronjob from "../../hooks/useCron";
import moment from "moment";
import ScrollableTabs from "../../components/design-system/ScrollableTabs";
import LiveList from "./LiveList";
import { PresenceOverviewResponse } from "../../services/usePresenceOverviewApi";

const Image = styled("img")({
  height: 24,
});

export interface PresenceHeaderProps {
  isEmployeeSpecific?: boolean;
  presenceOverview: PresenceOverviewResponse | null;
  fetchPresenceOverview: (
    params?: undefined
  ) => Promise<PresenceOverviewResponse>;
}

const Header: React.FC<PresenceHeaderProps> = ({
  isEmployeeSpecific,
  presenceOverview,
  fetchPresenceOverview,
}) => {
  const theme = useTheme();
  const [lastUpdatedTime, setLastUpdatedTime] = useState(
    moment(new Date()).format("hh:mm A")
  );

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  useCronjob(() => {
    setLastUpdatedTime(moment(new Date()).format("hh:mm A"));
    fetchPresenceOverview();
  }, 5);

  return (
    <Stack
      component={isSmallScreen ? ScrollableTabs : "div"}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        height: 54,
        px: 2,
        backgroundColor: theme.palette.mode === "light" ? "#ebeff2" : "#212832",
      }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Dropdown
          options={[{ label: "MS Teams", value: "teams" }]}
          value="teams"
          onChange={() => ""}
          renderValue={() => (
            <Stack direction="row" gap={1.5} alignItems="center" sx={{ ml: 1 }}>
              <Image src={teamsLogo} alt="teams" style={{ height: 24 }} />
              <Typography variant="h2">MS Teams</Typography>
            </Stack>
          )}
          testId="dashboard-teams-network-dropdown"
          forceBackgroundColor="transparent"
        />
      </Stack>
      {!isEmployeeSpecific && (
        <Stack direction="row" gap={2} alignItems="center">
          <LiveLabel time={lastUpdatedTime} direction="column" />
          <LiveList
            presenceOverview={presenceOverview}
            lastUpdatedTime={lastUpdatedTime}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default Header;
