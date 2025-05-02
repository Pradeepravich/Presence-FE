import { useMemo, useState } from "react";
import LayoutComponent from "../components/LayoutComponent";
import { Box } from "@mui/material";
import PresenceSection from "../sections/dashboard/PresenceSection";
import usePresenceApi, {
  PresenceRequestParams,
} from "../services/usePresenceApi";
import { AutoCompleteMultipleOption } from "../components/design-system/AutoCompleteMultiple";
import Filters from "../sections/dashboard/Filters";
import moment, { Moment } from "moment";
import Header from "../sections/dashboard/Header";
import { usePresenceOverviewApi } from "../services/usePresenceOverviewApi";

export interface FiltersOption {
  label: string;
  id: string;
}

export interface FiltersState {
  departments: FiltersOption[];
  shifts: FiltersOption[];
  projects: FiltersOption[];
  locations: FiltersOption[];
}

const Dashboard = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [date, setDate] = useState<Moment | null>(moment(new Date()));
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AutoCompleteMultipleOption[]>([]);
  const [workingStatus, setWorkingStatus] = useState<"working" | "idle">(
    "working"
  );
  const [sortBy, setSortBy] = useState("name");
  const { presenceOverview, fetchPresenceOverview } = usePresenceOverviewApi();

  const [filters, setFilters] = useState<FiltersState>({
    departments: [],
    shifts: [],
    projects: [],
    locations: [],
  });

  const presenceApiParams: PresenceRequestParams = useMemo(
    () => ({
      date: date?.format("YYYY-MM-DD") as string,
      availability: workingStatus === "working" ? "active" : "idle",
      page_size: 15,
      sort: sortBy,
      user_ids: users.map((u) => u.value).join(","),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      departments: filters.departments
        .filter((i) => i.id !== "0")
        .map((v) => v.id)
        .join(","),
      locations: filters.locations
        .filter((i) => i.id !== "0")
        .map((v) => v.id)
        .join(","),
      projects: filters.projects
        .filter((i) => i.id !== "0")
        .map((v) => v.id)
        .join(","),
      shifts: filters.shifts
        .filter((i) => i.id !== "0")
        .map((v) => v.id)
        .join(","),
    }),
    [
      date,
      filters.departments,
      filters.locations,
      filters.projects,
      filters.shifts,
      sortBy,
      users,
      workingStatus,
    ]
  );

  const { data, error, hasMore, isLoading, next, reset } =
    usePresenceApi(presenceApiParams);

  const handleResetFilters = () => {
    setUsers([]);
    setWorkingStatus("working");
    setSortBy("name");
    setDate(moment(new Date()));
    setFilters({
      departments: [],
      shifts: [],
      projects: [],
      locations: [],
    });
    reset();
  };

  return (
    <LayoutComponent>
      <Box>
        <Header
          presenceOverview={presenceOverview}
          fetchPresenceOverview={fetchPresenceOverview}
        />
        <Filters
          date={date}
          search={search}
          setDate={setDate}
          setSearch={setSearch}
          setUsers={setUsers}
          users={users}
          onResetFilters={handleResetFilters}
          exportParams={presenceApiParams}
          reset={reset}
          setSortBy={(val) => {
            setSortBy(val);
            reset();
          }}
          sortBy={sortBy}
          filters={filters}
          setFilters={setFilters}
          isFiltersOpen={isFiltersOpen}
          setFiltersPopupOpen={setIsFiltersOpen}
          fetchPresenceOverview={fetchPresenceOverview}
        />
        <PresenceSection
          setWorkingStatus={setWorkingStatus}
          workingStatus={workingStatus}
          data={data}
          isEmployeeSpecific={false}
          isLoading={isLoading}
          error={error}
          hasMore={hasMore}
          loadMore={next}
          reset={reset}
          filters={filters}
          setFilters={setFilters}
        />
      </Box>
    </LayoutComponent>
  );
};

export default Dashboard;
