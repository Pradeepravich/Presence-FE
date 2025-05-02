import { Stack, styled, Tab, Tabs, useTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../utils/constants";
import CardComponent from "../../components/design-system/Card";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "&.MuiTabs-root": {
    "& .MuiTab-root": {
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      textAlign: "left",
      alignItems: "flex-start",
      textTransform: "none",
      paddingRight: 8,
      paddingLeft: 8,
    },
    "& .MuiTab-root.Mui-selected": {
      backgroundColor: "rgba(79, 195, 247, 0.2)",
      borderLeft: "4px solid rgba(79, 195, 247, 1)",
      paddingLeft: 8,
    },
  },
}));

const ShiftTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const selectedTab = location.pathname.includes(APP_PATHS.employeeShiftMapping)
    ? APP_PATHS.employeeShiftMapping
    : APP_PATHS.allShifts;

  return (
    <Stack direction="row" gap={1}>
      <CardComponent sx={{ minWidth: 250 , height: "120px"}}>
        <StyledTabs
          orientation="vertical"
          value={selectedTab}
          onChange={(_, val) => navigate(val)}
          TabIndicatorProps={{ sx: { display: "none" } }}
        >
          <Tab
            label="All Shifts"
            value={APP_PATHS.allShifts}
            sx={{
              color: theme.palette.text.primary,
              "&.Mui-selected": {
                color: theme.palette.text.primary,
              },
            }}
          />
          <Tab
            label="Employee Shift Mapping"
            value={APP_PATHS.employeeShiftMapping}
            sx={{
              color: theme.palette.text.primary,
              "&.Mui-selected": {
                color: theme.palette.text.primary,
              },
            }}
          />
        </StyledTabs>
      </CardComponent>

      <Outlet />
    </Stack>
  );
};

export default ShiftTabs;
