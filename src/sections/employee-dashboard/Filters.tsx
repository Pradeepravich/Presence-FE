import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { PresenceFiltersContainer } from "../dashboard/Filters";
import { Button, Stack, styled, useTheme } from "@mui/material";
import { SetState } from "../../utils/types";
import moment, { Moment } from "moment";
import DateRangePicker, {
  DateRange,
} from "../../components/design-system/date-range/DateRangePicker";
import { useNavigate, useParams } from "react-router-dom";
import { getSameDayLastWeek } from "../../utils/date";
import {
  ExportUserPresenceParams,
  useExportUserPresenceApi,
} from "../../services/useExportUserPresenceApi";
import { downloadFile } from "../../utils";
import OrganizationIcon from "../../components/icons/OrganizationIcon";
import DownloadIcon from "../../components/icons/DownloadIcon";
import BackIcon from "../../components/icons/BackIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IconButtonBase } from "../../components/LayoutComponent";
import AutoCompleteSingle from "../../components/design-system/AutoCompleteSingle";
import { useUserDropdownApi } from "../../services/useUserDropdownApi";
import { APP_PATHS } from "../../utils/constants";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import ChatIcon from "../../components/icons/ChatIcon";

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#ebeff2" : "#212832",
  height: "33px",
  padding: "0 12px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#CFD8DC" : "#1c1c1c",
  },
}));

interface EmployeeFiltersProps {
  startDate: Moment | null;
  endDate: Moment | null;
  setStartDate: SetState<Moment | null>;
  setEndDate: SetState<Moment | null>;
  workingStatus: string;
  name?: string;
  reset: VoidFunction;
  employeeId: number;
  email?: string;
}

const Filters: FC<EmployeeFiltersProps> = ({
  endDate,
  startDate,
  setEndDate,
  setStartDate,
  workingStatus,
  name,
  reset,
  employeeId,
  email,
}) => {
  const params = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(params.userId || "");
  const [search, setSearch] = useState(name || "");

  const debouncedSearch = useDebouncedValue(search);

  const userParams = useMemo(
    () => ({
      query: debouncedSearch,
      sort: "name",
    }),
    [debouncedSearch]
  );

  const { value: userSearchResults } = useUserDropdownApi(userParams, true);

  const isEmployee = useSelector((state: RootState) => state.auth.isEmployee);

  const userOptions = useMemo(
    () =>
      userSearchResults?.results?.map?.((user) => ({
        label: user.name,
        value: user.id.toString(),
      })) || [],
    [userSearchResults]
  );

  useEffect(() => {
    if (params.userId && name) {
      setSelectedOption(params.userId);
      setSearch(name);
    }
  }, [params.userId, name]);

  const handleUserChange = useCallback(
    (selected: { label: string; value: string } | null) => {
      if (!selected) {
        setSelectedOption("");
        setSearch("");
        return;
      }

      if (selected.value !== selectedOption) {
        setSelectedOption(selected.value);
        setSearch(selected.label);
        navigate(APP_PATHS.employeeDashboard(selected.value));
      }
    },
    [navigate, selectedOption]
  );

  const handleDateRangeChange = useCallback(
    (value: DateRange) => {
      setStartDate(value[0]);
      setEndDate(value[1]);
      reset();
    },
    [reset, setEndDate, setStartDate]
  );

  const handleReset = useCallback(() => {
    setStartDate(getSameDayLastWeek());
    setEndDate(moment().endOf("day"));
    reset();
  }, [reset, setEndDate, setStartDate]);

  const isResetDisabled =
    getSameDayLastWeek().isSame(startDate) &&
    moment().endOf("day").isSame(endDate);

  const exportApiParams: ExportUserPresenceParams = useMemo(
    () => ({
      start_date: startDate?.format("YYYY-MM-DD") as string,
      end_date: endDate?.format("YYYY-MM-DD") as string,
      availability: workingStatus === "working" ? "active" : "idle",
      user_id: Number(params.userId),
    }),
    [endDate, params.userId, startDate, workingStatus]
  );

  const { fetchExportUserData } = useExportUserPresenceApi(exportApiParams);

  const handleExport = useCallback(async () => {
    const data = await fetchExportUserData();
    downloadFile(data);
  }, [fetchExportUserData]);

  return (
    <PresenceFiltersContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Stack direction="row" gap={1}>
          {!isEmployee && (
            <IconButtonBase onClick={() => navigate(APP_PATHS.dashboard)}>
              <BackIcon />
            </IconButtonBase>
          )}
          <AutoCompleteSingle
            options={userOptions}
            selectedOption={selectedOption}
            inputValue={search}
            setInputValue={setSearch}
            onChange={handleUserChange}
            forcedBackgroundColor={
              theme.palette.mode === "light" ? "#ebeff2" : "#212832"
            }
            placeholder="Search Employee"
            testId="employee-dashboard-search"
          />
          <DateRangePicker
            onChange={handleDateRangeChange}
            value={[startDate, endDate]}
            forcedBackgroundColor={
              theme.palette.mode === "light" ? "#ebeff2" : "#212832"
            }
            testId="employee-dashboard-dateRangePicker"
            height="35px"
          />
          <Button
            variant="contained"
            size="small"
            disabled={isResetDisabled}
            onClick={handleReset}
            data-testid="employee-dashboard-reset"
            sx={{ height: "34px" }}
          >
            Reset
          </Button>
        </Stack>
        <Stack direction="row" gap={1}>
          <StyledButton
            size="small"
            onClick={() =>
              navigate(`${APP_PATHS.orgChart}?employeeId=${employeeId}`)
            }
            startIcon={<OrganizationIcon />}
            data-testid="employee-dashboard-viewHierarchy"
          >
            View Hierarchy
          </StyledButton>
          <StyledButton
            size="small"
            onClick={() => {
              if (!email) return;
              window.open(APP_PATHS.teamsChat(email), "_blank");
            }}
            startIcon={<ChatIcon />}
            data-testid="employee-dashboard-viewHierarchy"
          >
            Chat in MS Teams
          </StyledButton>
          <StyledButton
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            data-testid="employee-dashboard-export"
          >
            Export
          </StyledButton>
        </Stack>
      </Stack>
    </PresenceFiltersContainer>
  );
};

export default Filters;
