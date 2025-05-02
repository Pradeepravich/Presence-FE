import Chart from "react-apexcharts";
import { barChartOptions } from "./chartProps";
import { useState, useCallback, useEffect } from "react";

const TimeSpentChart = () => {
  const options = barChartOptions(
    ["HR Team", "Design", "Front End", "Back End", "Network"],
    0,
    12,
    "hrs"
  );

  const [series1, setSeries1] = useState([5, 7, 4, 8, 9]);
  const [series2, setSeries2] = useState([4, 5, 3, 7, 5]);

  const updateChartValues = useCallback(() => {
    const newSeries1 = series1.map(() => Math.floor(Math.random() * 12) + 1);
    const newSeries2 = series2.map(() => Math.floor(Math.random() * 12) + 1);
    setSeries1(newSeries1);
    setSeries2(newSeries2);
  }, [series1, series2]);

  useEffect(() => {
    const intervalId = setInterval(() => updateChartValues(), 5000);
    return () => clearInterval(intervalId);
  }, [updateChartValues]);

  const series = [
    {
      name: "Working",
      data: series1,
    },
    {
      name: "Idle",
      data: series2,
    },
  ];

  return (
    <div>
      <Chart type="bar" options={options} width={650} series={series} />
    </div>
  );
};

export default TimeSpentChart;
