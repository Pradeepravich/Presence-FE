import { Stack, Typography, styled } from "@mui/material";
import { useMemo } from "react";
import PersonOutlineIcon from "../components/icons/PersonOutlineIcon";
// import AccessTimeIcon from "../assets/clock.svg";
import EventIcon from "../components/icons/EventIcon";
import FolderOutlinedIcon from "../components/icons/FolderOutlinedIcon";
import NotificationsOutlinedIcon from "../components/icons/NotificationsOutlinedIcon";
import CardComponent from "../components/design-system/Card";
import LayoutComponent from "../components/LayoutComponent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AccessTimeIcon from "../components/icons/AccessTimeIcon";
import ConfigurationIcon from "../components/icons/ConfigurationIcon";

const PageContainer = styled(Stack)(() => ({
  minHeight: "calc(100vh - 40px)",
  padding: "20px",
}));

const TabCard = styled(CardComponent)<{ isSelected: boolean }>(
  ({ isSelected, theme: { palette } }) => ({
    width: "100px",
    height: "65px",
    backgroundColor: isSelected
      ? "rgba(3, 155, 229, 0.16)"
      : palette.mode === "dark"
      ? "#2f2f37"  
      : palette.background.paper,
      opacity: isSelected ? 1 : 0.7,
    
    borderTop: isSelected ? "3px solid #039BE5" : "none",
    padding: "12px 9px 11px 9px",
    cursor: "pointer",
    "& .MuiSvgIcon-root": {
      fontSize: "20px",
    },
  })
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProjectAdmin = useSelector(
    (state: RootState) => state.auth.isProjectAdmin
  );

  const tabs = useMemo(() => {
    const projectTab = {
      label: "Projects",
      icon: <FolderOutlinedIcon />,
      path: APP_PATHS.projects,
      allowedPaths: [APP_PATHS.projects],
    };
    const allTabs = [
      {
        label: "Employees",
        icon: <PersonOutlineIcon />,
        path: APP_PATHS.employees,
        allowedPaths: [APP_PATHS.employees],
      },
      {
        label: "Shifts",
        icon: <AccessTimeIcon />,
        path: APP_PATHS.shiftsTab("all-shifts"),
        allowedPaths: [
          APP_PATHS.shiftsTab("all-shifts"),
          APP_PATHS.shiftsTab("employee-shifts"),
        ],
      },
      {
        label: "Holidays",
        icon: <EventIcon />,
        path: APP_PATHS.holidays,
        allowedPaths: [APP_PATHS.holidays],
      },
      projectTab,
      {
        label: "Manage Alerts",
        icon: <NotificationsOutlinedIcon />,
        path: APP_PATHS.alerts,
        allowedPaths: [APP_PATHS.alerts],
      },
      {
        label: "Config",
        icon: <ConfigurationIcon />,
        path: APP_PATHS.config,
        allowedPaths: [APP_PATHS.config],
      },
    ];

    if (isProjectAdmin) {
      return [projectTab];
    }

    return allTabs;
  }, [isProjectAdmin]);

  const selectedTab = tabs.findIndex((tab) =>
    tab?.allowedPaths
      ? tab?.allowedPaths.some((p) => location.pathname.endsWith(p))
      : location.pathname.endsWith(tab.path)
  );

  return (
    <LayoutComponent>
      <PageContainer spacing={2}>
        <Stack direction="row" gap={1}>
          {tabs.map((tab, index) => (
            <TabCard
              key={tab.label}
              isSelected={selectedTab === index}
              onClick={() => {
                navigate(tab.path);
              }}
            >
              <Stack gap={1} alignItems="center">
                {tab.icon}
                <Typography variant="body2">{tab.label}</Typography>
              </Stack>
            </TabCard>
          ))}
        </Stack>
        <Outlet />
      </PageContainer>
    </LayoutComponent>
  );
};

export default SettingsPage;
