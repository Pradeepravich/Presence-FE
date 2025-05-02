import Chart from "react-apexcharts";
import { AreaChartOptions } from "./chartProps";
import { FC } from "react";
import { StyledChartWrapper } from "../design-system/ChartWrapper";
import { useTheme } from "@mui/material";

export interface AreaChartProps {
  xAxis: string[];
  chartData: (number | null)[];
  height?: number | string;
}

const AreaChart: FC<AreaChartProps> = ({ xAxis, chartData, height }) => {
  const options = AreaChartOptions(xAxis);

  const theme = useTheme();

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
        options={options}
        height={height}
        series={[
          {
            name: "Working Hours",
            data: chartData,
          },
        ]}
        type="area"
      />
    </StyledChartWrapper>
  );
};

export default AreaChart;
