import { useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import { Close, InfoOutlined } from "@mui/icons-material";
import CardComponent from "../../components/design-system/Card";
import ExpandArrows from "../../assets/expand-arrows.svg";
import StackedBarChart from "../../components/charts/StackedBarChart";
import { AnalyticsResponse, ViewBy } from "../../services/useAnalyticsApi";
import { organisationStackedBarChartOptions } from "../../components/charts/chartProps";
import Tooltip from "../../components/design-system/Tooltip";

interface Props {
  analytics: AnalyticsResponse | null;
  viewBy: ViewBy;
}

const getChartData = (data: any[], key1: string) => {
  const categories = data?.map((item) => item[key1]);
  const working = data?.map((item) => item.working);

  return {
    categories,
    series: [{ name: "Working", data: working }],
  };
};

const OverviewGroupedBarChart = ({ analytics, viewBy }: Props) => {
  const theme = useTheme();
  const [openPopup, setOpenPopup] = useState<string | null>(null);

  if (!analytics) {
    return <Typography>No data available</Typography>;
  }

  const chartData = [
    {
      key: "Departments",
      data: getChartData(
        analytics.average_time_spent_by_department,
        "department"
      ),
      description: "Breakdown of average time spent by department.",
      title:
        viewBy !== "custom"
          ? `Shows the time spend by Team or Deparments Working over a ${viewBy}`
          : "Hourly average of employee  Working in a selected range",
    },
    {
      key: "Projects",
      data: getChartData(analytics.average_time_spent_by_project, "project"),
      description: "Time distribution across different projects.",
      title:
        viewBy !== "custom"
          ? viewBy === "day"
            ? "Hourly average of employees Working in a project in a day"
            : `Shows the employee’s average time spent Working in a project over a ${viewBy}`
          : "Hourly average of employees Working in selected range",
    },
    {
      key: "Locations",
      data: getChartData(analytics.average_time_spent_by_location, "location"),
      description: "Average work time in various locations.",
      title:
        viewBy !== "custom"
          ? viewBy === "day"
            ? "Hourly average of employees Working in a location over a day"
            : `Shows employee’s average time spent Working in a location over a ${viewBy}`
          : "Hourly average of employees Working in a selected range",
    },
    {
      key: "Shifts",
      data: getChartData(analytics.average_time_spent_by_shift, "shift"),
      description: "Analysis of working and idle hours across shifts.",
      title:
        viewBy !== "custom"
          ? viewBy === "day"
            ? "Hourly average of employees Working in a shift over a day"
            : `Shows employee's average time spent Working in a shift over a ${viewBy}`
          : "Hourly average of employees Working in a selected range",
    },
  ];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: 400 }}>
          Average Time Spent by
        </Typography>
      </Box>

      {/* Charts */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        {chartData.map(({ key, data, title }) => {
          const categories = data?.categories?.slice(0, 4);
          const series = data?.series?.map((item) => ({
            ...item,
            data: item.data?.slice(0, 4),
          }));
          return (
            <Box key={key} minWidth={0}>
              <CardComponent
                sx={{
                  height: "100%",
                  border: "0.5px solid #D3D3D3",
                  borderRadius: "8px",
                  p: 2,
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 400,
                        color:
                          theme.palette.mode === "light"
                            ? "#000000"
                            : "#FFFFFF",
                      }}
                    >
                      {key}
                    </Typography>
                    <IconButton size="small">
                      <Tooltip
                        title={title}
                        enterDelay={500}
                        enterNextDelay={500}
                      >
                        <InfoOutlined
                          sx={{
                            fontSize: 12,
                            color:
                              theme.palette.mode === "light"
                                ? "#000000"
                                : "#FFFFFF",
                          }}
                        />
                      </Tooltip>
                    </IconButton>
                  </Box>
                  <IconButton onClick={() => setOpenPopup(key)} size="small">
                    <img
                      src={ExpandArrows}
                      alt="Expand"
                      width={12}
                      height={12}
                    />
                  </IconButton>
                </Box>
                <StackedBarChart
                  xAxies={categories}
                  series={series}
                  BarChartOptions={{
                    ...organisationStackedBarChartOptions(categories),
                    legend: { show: false },
                  }}
                />
              </CardComponent>
            </Box>
          );
        })}
      </Box>

      {/* Popup for Expanded Chart */}
      <Dialog
        open={!!openPopup}
        onClose={() => setOpenPopup(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                sx={{ fontSize: "11px", fontWeight: "bold" }}
              >
                {openPopup}
              </Typography>
              <IconButton size="small">
                <Tooltip
                  title={
                    chartData.find((chart) => chart.key === openPopup)?.title ||
                    ""
                  }
                  enterDelay={500}
                  enterNextDelay={500}
                >
                  <InfoOutlined sx={{ fontSize: 18 }} />
                </Tooltip>
              </IconButton>
            </Box>
            <IconButton
              onClick={() => setOpenPopup(null)}
              size="small"
              sx={{ fontSize: 14 }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {chartData
            .filter((chart) => chart.key === openPopup)
            .map(({ data }) => (
              <StackedBarChart
                key={openPopup}
                xAxies={data.categories}
                series={data.series}
                BarChartOptions={organisationStackedBarChartOptions(
                  data.categories
                )}
              />
            ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OverviewGroupedBarChart;
