import {
  Box,
  Button,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dropdown, {
  DropdownOption,
} from "../../components/design-system/Dropdown";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "../../components/design-system/date-range/DatePicker";
import { SetState } from "../../utils/types";
import AutocompleteMultiple, {
  AutoCompleteMultipleOption,
} from "../../components/design-system/AutoCompleteMultiple";
import moment, { Moment } from "moment";
import { useExportApi } from "../../services/useExportPresenceApi";
import { PresenceRequestParams } from "../../services/usePresenceApi";
import { downloadFile } from "../../utils";
import ScrollableTabs from "../../components/design-system/ScrollableTabs";
import DashboardFilters from "./DashboardFilters";
import DownloadIcon from "../../components/icons/DownloadIcon";
import { FiltersState } from "../../pages/Dashboard";
import { useUserDropdownApi } from "../../services/useUserDropdownApi";
import { StyledButton } from "../employee-dashboard/Filters";

interface PresenceFiltersContainerProps {
  dashboard?: boolean;
}

export const PresenceFiltersContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "dashboard",
})<PresenceFiltersContainerProps>(({ theme, dashboard }) => ({
  paddingLeft: theme.spacing(2),
  backgroundColor: dashboard
    ? theme.palette.grey[800]
    : theme.palette.mode === "light"
      ? "#FFFFFF"
      : "#121a1c",
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

interface FiltersProps {
  date: Moment | null;
  setDate: SetState<Moment | null>;
  users: AutoCompleteMultipleOption[];
  setUsers: SetState<AutoCompleteMultipleOption[]>;
  search: string;
  setSearch: SetState<string>;
  onResetFilters: () => void;
  exportParams: PresenceRequestParams;
  reset: () => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filters: FiltersState;
  setFilters: SetState<FiltersState>;
  isFiltersOpen: boolean;
  setFiltersPopupOpen: SetState<boolean>;
  fetchPresenceOverview: VoidFunction;
}

const sortOptions: DropdownOption[] = [
  { value: "name", label: "First Name (A-Z)" },
  { value: "-name", label: "First Name (Z-A)" },
  { value: "time", label: "Time (ascending)" },
  { value: "-time", label: "Time (descending)" },
];

export const ExportButton = ({
  onClick,
  title,
}: {
  onClick?: () => Promise<void>;
  title: string;
}) => (
  <Button
    sx={{ "@media print": { display: "none" } }}
    size="small"
    startIcon={<DownloadIcon />}
    onClick={onClick}
  >
    {title}
  </Button>
);

const Filters: FC<FiltersProps> = ({
  date,
  setDate,
  users,
  setUsers,
  onResetFilters,
  exportParams,
  reset,
  setSortBy,
  sortBy,
  filters,
  setFilters,
  isFiltersOpen,
  setFiltersPopupOpen,
  fetchPresenceOverview,
}) => {
  const theme = useTheme();
  const handleDateChange: (date: Moment | null) => void = useCallback(
    (date) => {
      setDate(date);
      reset();
    },
    [reset, setDate]
  );

  const handleUsersChange = useCallback(
    (users: AutoCompleteMultipleOption[]) => {
      reset();
      setUsers(users);
    },
    [reset, setUsers]
  );
  const { fetchExportData } = useExportApi(exportParams);

  const getExportData = useCallback(async () => {
    const data = await fetchExportData();
    downloadFile(data);
  }, [fetchExportData]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const isFilterSelected = useMemo(
    () =>
      filters.departments.length ||
      filters.locations.length ||
      filters.projects.length ||
      filters.shifts.length,
    [filters]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      isFilterSelected ||
      users.length > 0 ||
      sortBy !== "name" ||
      date?.format("YYYY-MM-DD") !== moment(new Date()).format("YYYY-MM-DD")
    );
  }, [isFilterSelected, users.length, sortBy, date]);

  const [search, setSearch] = useState("");
  const memoizedParams = useMemo(
    () => ({ query: search, sort: "name" }),
    [search]
  );
  const {
    value: dropdownData,
    isLoading: searchLoading,
    execute,
  } = useUserDropdownApi(memoizedParams, false);

  useEffect(() => {
    if (search.trim().length > 0) {
      execute();
    }
  }, [search, execute]);

  const userOptions = useMemo(() => {
    return (
      dropdownData?.results?.map((user) => ({
        label: user.name,
        value: user.id.toString(),
      })) || []
    );
  }, [dropdownData]);

  return (
    <PresenceFiltersContainer>
      <Stack
        component={isSmallScreen ? ScrollableTabs : "div"}
        direction="row"
        gap={2}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" gap={2} alignItems="start">
          <DatePicker
            value={date}
            onChange={handleDateChange}
            forcedColor={theme.palette.mode === "light" ? "#ebeff2" : "#212832"}
            testId="dashboard-datepicker"
          />
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            reset={reset}
            isFiltersOpen={isFiltersOpen}
            setFiltersPopupOpen={setFiltersPopupOpen}
          />

          <Box width={300}>
            <AutocompleteMultiple
              options={userOptions}
              selectedOptions={users}
              forcedBackgroundColor={
                theme.palette.mode === "light" ? "#ebeff2" : "#212832"
              }
              inputValue={search}
              setInputValue={setSearch}
              onChange={handleUsersChange}
              testId="dashboard-search"
              loading={searchLoading}
              onFocus={() => {
                if (!userOptions.length || search === "") {
                  setSearch("");
                  execute();
                }
              }}
            />
          </Box>
          <Button
            disabled={!hasActiveFilters}
            onClick={() => {
              onResetFilters();
            }}
            sx={{
              px: 1,
              py: 1.25,
            }}
            variant="contained"
            data-testid="dashoboard-resetallfliters"
          >
            Reset All
          </Button>
          <Button
            onClick={() => {
              reset();
              fetchPresenceOverview();
            }}
            sx={{
              px: 1,
              py: 1.25,
            }}
            variant="contained"
            data-testid="dashoboard-resetallfliters"
          >
            Refresh
          </Button>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center" ml={2}>
          <Dropdown
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            setState={setSortBy}
            testId="dashboard-sort-dropdown"
            renderValue={(value) => (
              <Box>
                <Box component="span" fontWeight={400}>
                  Sort by &nbsp;
                </Box>
                <Box component="span" fontWeight={700}>
                  {sortOptions.find((option) => option.value === value)?.label}
                </Box>
              </Box>
            )}
            forceBackgroundColor={
              theme.palette.mode === "light" ? "#ebeff2" : "#212832"
            }
          />
          <Box ml="auto">
            {" "}
            {/* Push the button to the right */}
            <StyledButton
              startIcon={<DownloadIcon />}
              onClick={getExportData}
              data-testid="dashboard-export"
            >
              Export
            </StyledButton>
          </Box>
        </Stack>
      </Stack>
    </PresenceFiltersContainer>
  );
};

export default Filters;
