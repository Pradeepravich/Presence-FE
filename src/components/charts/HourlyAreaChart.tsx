import { FC } from "react";
import { convertTo2Digits } from "../../utils/format";
import AreaChart from "./AreaChart";

interface Props {
  isToday?: boolean;
  data: Record<string, number>;
  height?: number | string;
}

const HourlyAreaChart: FC<Props> = ({ isToday = false, data, height }) => {
  const currentTimeIndex = new Date().getHours();
  const areaChartXaxis = Array.from({
    length: isToday ? currentTimeIndex + 1 : 24,
  }).map((_, i) => `${convertTo2Digits(i + 1)}:00`);
  const areaChartData = areaChartXaxis.map((i) => data?.[i] || 0);

  return (
    <AreaChart
      chartData={areaChartData}
      xAxis={areaChartXaxis}
      height={height}
    />
  );
};

export default HourlyAreaChart;
