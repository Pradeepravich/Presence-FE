import Chart from "react-apexcharts";
import { stackedBarChartOptions } from "./chartProps";
import { StyledChartWrapper } from "../design-system/ChartWrapper";
import { useMediaQuery, useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";

export interface StackedBarChartSeriesItem {
  name: string;
  data: number[];
}

interface props {
  series: StackedBarChartSeriesItem[];
  xAxies: string[];
  yAxisMax?: number;
  BarChartOptions?: ApexOptions;
}
const StackedBarChart = ({
  xAxies,
  series,
  yAxisMax,
  BarChartOptions,
}: props) => {
  const theme = useTheme();
  const options = stackedBarChartOptions(
    xAxies,
    yAxisMax,
    theme.palette.mode === "light"
  );
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  return (
    <StyledChartWrapper
      sx={{
        ".apexcharts-text": {
          fill: theme.palette.mode === "dark" ? "#ffffff" : "#A8A8A8",
          fontSize: 9,
        },
      }}
    >
      <Chart
        key={Math.random()}
        options={BarChartOptions || options}
        series={series}
        type="bar"
        height={isSmallScreen ? 300 : undefined}
      />
    </StyledChartWrapper>
  );
};

export default StackedBarChart;
