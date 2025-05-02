import DateRangePicker, {
  DateRange,
} from "../../components/design-system/date-range/DateRangePicker";
import Dropdown, {
  DropdownOption,
  DropdownProps,
} from "../../components/design-system/Dropdown";
import {
  Box,
  Button,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PresenceFiltersContainer } from "../dashboard/Filters";
import {
  daysViewOptions,
  analysisLevelOptions,
  DURATION_TYPES,
} from "../../utils/constants";
import { SetState } from "../../utils/types";
import { AutoCompleteSingleOption } from "../../components/design-system/AutoCompleteSingle";
import DatePicker from "../../components/design-system/date-range/DatePicker";
import WeekPicker from "../../components/design-system/date-range/WeekPicker";
import YearPicker from "../../components/design-system/date-range/YearPicker";
import MonthPicker from "../../components/design-system/date-range/MonthPicker";
import { useEffect, useMemo } from "react";
import {
  AnalysisLevelType,
  analysisLevelVal,
  ViewBy,
} from "../../services/useAnalyticsApi";
import { useDepartmentsApi } from "../../services/useDepartmentsApi";
import moment from "moment";
// import { Print } from "@mui/icons-material";
import ScrollableTabs from "../../components/design-system/ScrollableTabs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OverviewAutoComplete from "../../components/OverviewAutoComplete";
import teamsLogo from "../../assets/teams-logo.svg";
import PrintIcon from "../../components/icons/PrintIcon";
// import { usePresenceOverviewApi } from "../../services/usePresenceOverviewApi";

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "white" : "black",
  height: "25px",
  padding: "0 12px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#CFD8DC" : "#1c1c1c",
  },
}));

interface props {
  range: DateRange;
  setRange: SetState<DateRange>;
  viewBy: ViewBy;
  setViewBy: SetState<ViewBy>;
  analysisLevel: AnalysisLevelType;
  setAnalysisLevel: SetState<AnalysisLevelType>;
  handleChange: (selected: AutoCompleteSingleOption | null) => void;
  filterValue: string;
  setFilterValue: SetState<string>;
}
const OverviewFilters = ({
  range,
  setRange,
  viewBy,
  setViewBy,
  analysisLevel,
  setAnalysisLevel,
  handleChange,
  filterValue,
  setFilterValue,
}: props) => {
  const handleDayChange = (value: ViewBy) => {
    setViewBy(value);
    if (value === "day") {
      const yesterday = moment().subtract(1, "day");
      setRange([
        yesterday.clone().startOf("day"),
        yesterday.clone().endOf("day"),
      ]);
    } else {
      setRange([
        DURATION_TYPES[value].startDate,
        DURATION_TYPES[value].endDate,
      ]);
    }
  };
  const { departments, fetchDepartments } = useDepartmentsApi(false);

  const theme = useTheme();

  const handleModeChange = async (value: AnalysisLevelType) => {
    setAnalysisLevel(value);
    if (value === analysisLevelVal.dept) {
      if (departments) setFilterValue(departmentFilterOptions[0]?.value);
      else {
        const depts = await fetchDepartments();
        setFilterValue(depts[0]);
      }
    }
  };

  const pickers: any = {
    custom: DateRangePicker,
    week: WeekPicker,
    month: MonthPicker,
    year: YearPicker,
  };

  const SelectedPicker = pickers[viewBy as keyof typeof pickers];

  const departmentFilterOptions: DropdownOption[] = useMemo(
    () => [
      ...(departments?.map((department) => ({
        value: department,
        label: department,
      })) || []),
    ],
    [departments]
  );

  const handleResetFilters = () => {
    setViewBy(daysViewOptions[0].value);
    setAnalysisLevel(analysisDropdownOptions[0].value);
    const yesterday = moment().subtract(1, "day");
    setRange([
      yesterday.clone().startOf("day"),
      yesterday.clone().endOf("day"),
    ]);
  };

  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  const { isEmployee, isProjectAdmin, isManager, user } = useSelector(
    (state: RootState) => state.auth // Access values from AuthSlice
  );

  const analysisDropdownOptions = useMemo(() => {
    const updatedOptions = analysisLevelOptions.map((option) => {
      if (isProjectAdmin) {
        const shouldShow =
          option.value === analysisLevelVal.emp ||
          option.value === analysisLevelVal.proj;
        return { ...option, show: shouldShow };
      }
      if (isEmployee || isManager) {
        const shouldShow = option.value === analysisLevelVal.emp;
        return { ...option, show: shouldShow };
      }
      return { ...option, show: true };
    });

    return updatedOptions.filter((option) => option.show);
  }, [isEmployee, isManager, isProjectAdmin]);

  const hasActiveFilters = useMemo(() => {
    const yesterday = moment().subtract(1, "day").startOf("day");

    return (
      viewBy !== daysViewOptions[0]?.value ||
      analysisLevel !== analysisDropdownOptions[0]?.value ||
      !moment(range[0]).isSame(yesterday, "day") ||
      !moment(range[1]).isSame(yesterday, "day")
    );
  }, [viewBy, analysisLevel, analysisDropdownOptions, range]);

  useEffect(() => {
    setAnalysisLevel(analysisDropdownOptions[0].value);
  }, [analysisDropdownOptions, setAnalysisLevel]);

  return (
    <PresenceFiltersContainer as={Box} dashboard>
      <Stack direction="row" gap={2} alignItems="center">
        <Dropdown
          options={[{ label: "MS Teams", value: "teams" }]}
          value="teams"
          onChange={() => ""}
          renderValue={() => (
            <Stack direction="row" gap={1.5}>
              <img src={teamsLogo} alt="teams" />
              <Typography variant="h5">MS Teams </Typography>
            </Stack>
          )}
          testId="dashboard-teams-network-dropdown"
          forceBackgroundColor="transparent"
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          component={isSmallScreen ? ScrollableTabs : "div"}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Stack direction="row" gap={2} alignItems="center">
            <Typography>View by</Typography>
            <Dropdown
              options={daysViewOptions}
              value={viewBy}
              onChange={handleDayChange as DropdownProps["onChange"]}
              backgroundColor={theme.palette.common.white}
              testId="overview-daysViewBy-dropdown"
            />
            {(isProjectAdmin || user?.is_admin) && (
              <Dropdown
                options={analysisDropdownOptions}
                value={analysisLevel}
                onChange={handleModeChange as DropdownProps["onChange"]}
                backgroundColor={theme.palette.common.white}
                testId="overview-analysisLevel-dropdown"
              />
            )}
            <Box bgcolor="#A8A8A8" width="1px" height="15px" />
            <Typography>Filter by</Typography>
            {viewBy === "day" ? (
              <DatePicker
                value={range[0]}
                onChange={(d) =>
                  setRange([
                    d?.clone()?.startOf("day") || null,
                    d?.clone()?.endOf("day") || null,
                  ])
                }
                backgroundColor={theme.palette.common.white}
                testId="overview-datepicker-dropdwon"
                maxDate={moment().subtract(1, "day").endOf("day")}
                shouldDisableDate={(date) => date.isSame(moment(), "day")}
                disableFuture
              />
            ) : (
              <SelectedPicker
                value={range}
                onChange={setRange}
                backgroundColor={theme.palette.common.white}
                testId="overview-datepicker-dropdown"
              />
            )}

            {analysisLevel === analysisLevelVal.dept && (
              <Dropdown
                options={departmentFilterOptions}
                value={filterValue}
                onChange={(val) => setFilterValue(val)}
                backgroundColor={theme.palette.common.white}
                testId="overview-department-dropdown"
              />
            )}

            <OverviewAutoComplete
              filterValue={filterValue}
              analysisLevel={analysisLevel}
              handleChange={handleChange}
            />
            <Button
              sx={{ "@media print": { display: "none" } }}
              variant="contained"
              disabled={!hasActiveFilters}
              onClick={handleResetFilters}
              data-testid="overview-reset"
            >
              Reset
            </Button>
          </Stack>
          <StyledButton
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            data-testid="overview-print"
          >
            Print
          </StyledButton>
          </Stack>
      </Stack>
    </PresenceFiltersContainer>
  );
};

export default OverviewFilters;
