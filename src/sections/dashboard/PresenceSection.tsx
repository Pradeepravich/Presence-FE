import {
  Stack,
  styled,
  useMediaQuery,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import DashboardTable from "./DashboardTable";
import { PresenceResult } from "../../services/usePresenceApi";
import { PresenceUserResult } from "../../services/usePresenceUserApi";
import ScrollableTabs from "../../components/design-system/ScrollableTabs";
import ActivityLegend from "./ActivityLegend";
import { idleLegends, workingLegends } from "../../utils/constants";
import { SetState } from "../../utils/types";
import { FiltersOption, FiltersState } from "../../pages/Dashboard";
import { getGMTOffsetFromTimezone } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "../../components/design-system/Tooltip"; // Use reusable Tooltip component

const PresenceSectionContainer = styled("section")(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.background.paper : "#121a1c",
  maxWidth: "100%",
}));

interface CommonProps {
  workingStatus: "working" | "idle";
  setWorkingStatus: Dispatch<SetStateAction<"working" | "idle">>;
  isLoading: boolean;
  name?: string;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  filters?: FiltersState;
  setFilters?: SetState<FiltersState>;
  setFiltersPopupOpen?: SetState<boolean>;
  timezone?: string;
}

type PresenceSectionProps<T extends boolean> = CommonProps &
  (T extends true
    ? {
        isEmployeeSpecific: true;
        data: PresenceUserResult[];
      }
    : {
        isEmployeeSpecific: false;
        data: PresenceResult[];
      });

const MAX_VISIBLE_CHIPS = 5;

const PresenceSection = <T extends boolean>({
  workingStatus,
  data,
  isEmployeeSpecific,
  isLoading,
  name,
  error,
  hasMore,
  loadMore,
  reset,
  filters,
  setFilters,
  setFiltersPopupOpen,
  timezone,
}: PresenceSectionProps<T>) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const allFilters = useMemo(
    () =>
      filters
        ? [
            ...(filters?.departments?.map((filter) => ({
              ...filter,
              type: "department",
            })) || []),
            ...(filters?.shifts?.map((filter) => ({
              ...filter,
              type: "shift",
            })) || []),
            ...(filters?.projects?.map((filter) => ({
              ...filter,
              type: "project",
            })) || []),
            ...(filters?.locations?.map((filter) => ({
              ...filter,
              type: "location",
            })) || []),
          ].filter((filter) => filter.id !== "0")
        : [],
    [filters]
  );

  const handleDelete = useCallback(
    (filter: FiltersOption & { type: string }) => {
      setFilters?.((prev) => {
        switch (filter.type) {
          case "department":
            return {
              ...prev,
              departments: prev.departments.filter(
                (f) => f.id !== filter.id && f.id !== "0"
              ),
            };
          case "shift":
            return {
              ...prev,
              shifts: prev.shifts.filter(
                (f) => f.id !== filter.id && f.id !== "0"
              ),
            };
          case "project":
            return {
              ...prev,
              projects: prev.projects.filter(
                (f) => f.id !== filter.id && f.id !== "0"
              ),
            };
          case "location":
            return {
              ...prev,
              locations: prev.locations.filter(
                (f) => f.id !== filter.id && f.id !== "0"
              ),
            };
          default:
            return prev;
        }
      });
      reset();
    },
    [setFilters, reset]
  );

  const chips = allFilters?.slice(0, MAX_VISIBLE_CHIPS);

  return (
    <PresenceSectionContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        component={isSmallScreen ? ScrollableTabs : "div"}
        mb={2}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography>
            {isEmployeeSpecific
              ? name && timezone
                ? `${name} is working in ${getGMTOffsetFromTimezone(timezone)} timezone`
                : ""
              : `Showing ${data.length} employees${allFilters.length > 0 ? " in" : ""}`}
          </Typography>
          <Stack direction="row" spacing={1}>
            {chips?.map((filter) => (
              <Chip
                key={`${filter.type}-${filter.id}`}
                label={filter.label}
                onDelete={() => handleDelete(filter)}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ fontSize: 10 }}
                deleteIcon={<CloseIcon fontSize="inherit" />}
              />
            ))}
            {allFilters.length > MAX_VISIBLE_CHIPS && (
              <Tooltip
                title={
                  <Stack>
                    {allFilters.slice(MAX_VISIBLE_CHIPS).map((filter) => (
                      <Typography key={filter.id} variant="body2">
                        {filter.label}
                      </Typography>
                    ))}
                  </Stack>
                }
                arrow
              >
                <Chip
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setFiltersPopupOpen?.(true)}
                  sx={{
                    fontSize: 10,
                    px: 0.5,
                    borderColor:
                      theme.palette.mode === "light" ? "#039BE5" : "#3282B8",
                  }}
                  label={`+${allFilters.length - MAX_VISIBLE_CHIPS}`}
                />
              </Tooltip>
            )}
          </Stack>
        </Stack>

        <ActivityLegend
          legends={
            workingStatus === "working"
              ? workingLegends(theme.palette.mode === "light")
              : idleLegends(theme.palette.mode === "light")
          }
        />
      </Stack>

      {isEmployeeSpecific ? (
        <DashboardTable<true>
          data={data as PresenceUserResult[]}
          isEmployeeSpecific={true}
          isLoading={isLoading}
          status={workingStatus}
          noRecords={"No Data available"}
          name={name}
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      ) : (
        <DashboardTable<false>
          data={data as PresenceResult[]}
          isEmployeeSpecific={false}
          isLoading={isLoading}
          status={workingStatus}
          noRecords="No Data available"
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      )}
    </PresenceSectionContainer>
  );
};

export default PresenceSection;
