import { Box, Stack } from "@mui/material";
import StackedBarChart from "../../components/charts/StackedBarChart";
import CardComponent from "../../components/design-system/Card";
import Description from "./Description";
import { FC, useMemo } from "react";
import {
  AnalysisLevelType,
  analysisLevelVal,
  AnalyticsResponse,
  ViewBy,
} from "../../services/useAnalyticsApi";
import HourlyAreaChart from "../../components/charts/HourlyAreaChart";
import OverviewGroupedBarChart from "../detailedOverview/OverviewGroupedBarChart";
import WorkingIcon from "../../components/icons/WorkingIcon";

interface Props {
  viewBy: ViewBy;
  analysisLevel: AnalysisLevelType;
  analytics: AnalyticsResponse | null;
  isTodayOptionSelected: boolean;
  title?: string;
  description?: string;
  stackChartDescription?: string;
  stackChartTitle?: string;
  stackChartHeading?: string;
}

const OverviewStackedBarChart: FC<Props> = ({
  viewBy,
  analysisLevel,
  analytics,
  isTodayOptionSelected,
  title,
  stackChartDescription = "",
  stackChartTitle,
  stackChartHeading = "Average working hours by time",
}) => {
  const { xAxisKey, seriesKey } = useMemo(() => {
    let xAxisKey = "department";
    let seriesKey = "average_time_spent_by_department";

    if (analysisLevel !== "organization") {
      if (viewBy === "week") {
        seriesKey = "average_time_spent_by_day";
        xAxisKey = "day";
      } else if (viewBy === "month") {
        seriesKey = "average_time_spent_by_week";
        xAxisKey = "week";
      } else if (viewBy === "year") {
        seriesKey = "average_time_spent_by_month";
        xAxisKey = "month";
      }
    }

    return { xAxisKey, seriesKey } as const;
  }, [analysisLevel, viewBy]);

  const stackedBarChartXAxies =
    (analytics as any)?.[seriesKey]?.map((item: any) => item[xAxisKey]) || [];

  const stackedBarChartSeries =
    (analytics as any)?.[seriesKey]?.reduce(
      (acc: any, val: any) => {
        acc[0]?.data.push(val.working);

        return acc;
      },
      [{ name: "Working", data: [] }]
    ) || [];
  const seriesData = stackedBarChartSeries?.[0]?.data || [];
  const maxValue = Math.max(...seriesData, 0);
  return (
    <Box minWidth={0}>
      <CardComponent
        sx={{
          "@media print": { width: "100%" },
          height: analysisLevel !== analysisLevelVal.org ? "100%" : undefined,
        }}
      >
        {analysisLevel !== analysisLevelVal.org &&
          (viewBy === "day" || viewBy === "custom" ? (
            <>
              <Stack
                direction="row"
                gap={2}
                flexWrap="wrap"
                justifyContent={"space-between"}
              >
                <Description title={title}>{stackChartHeading}</Description>
                <WorkingIcon />
              </Stack>
              <HourlyAreaChart
                isToday={isTodayOptionSelected}
                data={analytics?.hourly_working_average || {}}
                // height={"100px"}
              />
            </>
          ) : (
            <>
              <Stack
                direction="row"
                gap={2}
                flexWrap="wrap"
                justifyContent={"space-between"}
              >
                <Description title={stackChartTitle}>
                  {stackChartDescription}
                </Description>
                <WorkingIcon />
              </Stack>
              <StackedBarChart
                yAxisMax={maxValue + 45}
                xAxies={stackedBarChartXAxies}
                series={stackedBarChartSeries}
              />
            </>
          ))}
        {analysisLevel === analysisLevelVal.org && (
          <OverviewGroupedBarChart analytics={analytics} viewBy={viewBy} />
        )}
      </CardComponent>
    </Box>
  );
};

export default OverviewStackedBarChart;
