import { Box, Stack, Typography, useTheme } from "@mui/material";
import CardComponent from "../components/design-system/Card";
import { overViewCardsData, overViewProps } from "../utils/format";
import OverviewDonutChart from "../sections/analytics/OverviewDonutChart";
import OverviewStackedBarChart from "../sections/analytics/OverviewStackedBarChart";
import LeaderboardChart from "../components/charts/LeaderboardChart";
import Description from "../sections/analytics/Description";
import OverviewFilters from "../sections/analytics/OverviewFilters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "../components/design-system/date-range/DateRangePicker";
import {
  analysisLevelOptions,
  AVAILABILITY_STATUS_KEYS,
  daysViewOptions,
} from "../utils/constants";
import OverviewDetails from "../sections/analytics/OverviewDetails";
import moment from "moment";
import LayoutComponent from "../components/LayoutComponent";
import {
  AnalysisLevelType,
  analysisLevelVal,
  AnalyticsRequestParams,
  useAnalyticsApi,
  ViewBy,
} from "../services/useAnalyticsApi";
import { AutoCompleteSingleOption } from "../components/design-system/AutoCompleteSingle";
import LoadingOverlay from "../components/design-system/LoadingOverlay";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { isToday } from "../utils/date";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type DurationCardComponentProps = {
  mode: string;
  value: string;
  percent?: number;
  title?: string;
};

const DurationCardComponent = ({
  mode,
  value,
  percent,
  title = "",
}: DurationCardComponentProps) => {
  const theme = useTheme();
  return (
    <CardComponent sx={{ flex: "1 1 150px" }}>
      <Description title={title}>{mode}</Description>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography variant="h1">{value}</Typography>
        {percent && (
          <Box
            p="3px 4px"
            borderRadius="4px"
            bgcolor={theme.palette.mode === "light" ? "#0000001A" : "#FFFFFF1A"}
          >
            <Typography variant="h5" p="4px" borderRadius={2}>
              {percent}%
            </Typography>
          </Box>
        )}
      </Stack>
    </CardComponent>
  );
};
const Overview = () => {
  const [range, setRange] = useState<DateRange>(() => {
    const yesterday = moment().subtract(1, "day");
    return [yesterday.clone().startOf("day"), yesterday.clone().endOf("day")];
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const isEmployee = useSelector((state: RootState) => state.auth.isEmployee);

  const [viewBy, setViewBy] = useState<ViewBy>(daysViewOptions[0].value);

  const [analysisLevel, setAnalysisLevel] = useState<AnalysisLevelType>(
    analysisLevelOptions[0].value
  );
  const [filterValue, setFilterValue] = useState("");

  const [stableFilterValue, setStableFilterValue] = useState("");

  useEffect(() => {
    if (filterValue) {
      setStableFilterValue(filterValue);
    }
  }, [filterValue]);

  const params: AnalyticsRequestParams = useMemo(() => {
    const startDate = (range[0] || moment()).format("YYYY-MM-DD");
    const endDate = (range[1] || moment()).format("YYYY-MM-DD");

    const baseParams = {
      analysis_level: analysisLevel,
      view_by: viewBy,
      start_date: startDate,
      end_date: endDate,
    };

    const deptParams =
      analysisLevel === analysisLevelVal.dept
        ? { [analysisLevelVal.dept]: stableFilterValue }
        : {};

    const levelIdKey = `${analysisLevel}_id`;
    const levelIdParam =
      analysisLevel !== analysisLevelVal.dept &&
      analysisLevel !== analysisLevelVal.org
        ? { [levelIdKey]: stableFilterValue }
        : {};

    return {
      ...baseParams,
      ...deptParams,
      ...levelIdParam,
    };
  }, [analysisLevel, range, stableFilterValue, viewBy]);

  const debouncedParams = useDebouncedValue(params);
  const { value, isLoading, fetchAnalytics } = useAnalyticsApi(debouncedParams);

  const handleUserChange = useCallback(
    (val: AutoCompleteSingleOption | null) => setFilterValue(val?.value || ""),
    []
  );

  const data = AVAILABILITY_STATUS_KEYS.map(
    (s) => value?.average_time_spent_by_status?.[s] || 0
  );

  const isTodayOptionSelected = useMemo(
    () => isToday(range[0]) && viewBy === "day",
    [range, viewBy]
  );

  const cardsData = overViewCardsData(
    analysisLevel,
    isTodayOptionSelected,
    viewBy,
    value
  );

  const {
    title,
    description,
    hourlyChartTitle,
    stackChartDescription,
    stackChartTitle,
    stackChartHeading,
  } = overViewProps(analysisLevel, viewBy);

  const isSharedSection = (
    [
      analysisLevelVal.dept,
      analysisLevelVal.loc,
      analysisLevelVal.proj,
      analysisLevelVal.shift,
    ] as AnalysisLevelType[]
  ).includes(analysisLevel);

  useEffect(() => {
    if (isEmployee) {
      setAnalysisLevel(analysisLevelVal.emp);
      setFilterValue(user?.id.toString() || "");
      fetchAnalytics();
    }
  }, [fetchAnalytics, isEmployee, user?.id]);

  return (
    <LayoutComponent>
      <LoadingOverlay isLoading={isLoading} />
      <OverviewFilters
        range={range}
        viewBy={viewBy}
        setRange={setRange}
        setViewBy={setViewBy}
        analysisLevel={analysisLevel}
        setAnalysisLevel={setAnalysisLevel}
        handleChange={handleUserChange}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <Box m={2}>
        <Box
          display={analysisLevel !== analysisLevelVal.org ? "grid" : ""}
          gridTemplateColumns={{ lg: "1.5fr 5fr" }}
          gap={2}
        >
          {analysisLevel !== analysisLevelVal.org && (
            <OverviewDetails
              user={value?.user || null}
              employees={value?.employees || []}
              heading={value?.name || ""}
              isSharedSection={isSharedSection}
            />
          )}
          <Box
            display={analysisLevel === analysisLevelVal.org ? "grid" : ""}
            gridTemplateColumns={{ lg: "4fr 1fr" }}
            gap={2}
          >
            <Box sx={{ height: "100%" }}>
              <Stack direction="row" gap={2} flexWrap="wrap">
                {cardsData.map((item) => (
                  <DurationCardComponent {...item} />
                ))}
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xl: "1fr 2fr",
                    md: "2fr 4fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                  mt: 2,
                  "@media print": {
                    display: "flex",
                    gap: 1,
                    width: "100%",
                  },
                }}
              >
                <OverviewDonutChart
                  data={data}
                  title={title}
                  description={description}
                />

                <OverviewStackedBarChart
                  viewBy={viewBy}
                  analysisLevel={analysisLevel}
                  analytics={value ?? null}
                  isTodayOptionSelected={isTodayOptionSelected}
                  title={hourlyChartTitle}
                  stackChartDescription={stackChartDescription}
                  stackChartTitle={stackChartTitle}
                  stackChartHeading={stackChartHeading}
                />
              </Box>
            </Box>
            {analysisLevel === analysisLevelVal.org && (
              <Stack
                sx={{
                  "@media print": {
                    display: "flex",
                    width: "100%",
                    pageBreakInside: "avoid",
                  },
                }}
              >
                <LeaderboardChart startDate={range?.[0]} endDate={range?.[1]} />
              </Stack>
            )}
          </Box>
        </Box>
      </Box>
    </LayoutComponent>
  );
};

export default Overview;
