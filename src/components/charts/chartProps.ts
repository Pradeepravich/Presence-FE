import { ApexOptions } from "apexcharts";
import { formatTime } from "../../utils/format";
import { AVAILABILITY_STATUSES } from "../../utils/constants";

export type DonutChartOnClickFunc = (label: string, index: number) => void;
export const donutChartOptions: (
  onClick: DonutChartOnClickFunc,
  mode: string
) => ApexOptions = (onClick, mode) => {
  const isDarkMode = mode === "dark";
  const darkModeColors = [
    "#8FAF95",
    "#C96666",
    "#C96666",
    "#E1AB5D",
    "#E1AB5D",
    "#A8A8A8",
  ];

  return {
    chart: {
      events: {
        dataPointSelection: (_, __, config) => {
          onClick(
            config.w.config.labels[config.dataPointIndex],
            config.dataPointIndex
          );
        },
      },
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: "80%",
        },
        dataLabels: {
          offset: 40,
        },
      },
    },
    stroke: {
      width: mode === "light" ? 1 : 0,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "9px", // Explicitly set font size to 9px
      },
      dropShadow: {
        enabled: false,
      },
      formatter: (_, opts) => {
        const total = opts.w.globals.series.reduce(
          (acc: any, curr: any) => acc + curr,
          0
        );
        const roundedValues = opts.w.globals.series.map((value: any) => {
          return Math.round((value / total) * 100);
        });

        const sum = roundedValues.reduce(
          (acc: any, curr: any) => acc + curr,
          0
        );
        const diff = 100 - sum;
        roundedValues[roundedValues.length - 1] += diff;

        return `${roundedValues[opts.seriesIndex]}%`;
      },
      offsetX: 0,
      offsetY: 0,
      textAnchor: "middle",
    },
    colors: isDarkMode
      ? darkModeColors // Use predefined lighter colors for dark mode
      : AVAILABILITY_STATUSES.map((s) => s.color),
    labels: AVAILABILITY_STATUSES.map((s) => s.value),
    tooltip: {
      y: {
        formatter: (value: number) => formatTime(value),
      },
    },
  };
};

export const AreaChartOptions = (xAxisNodes: string[]): ApexOptions => ({
  chart: {
    toolbar: { show: false },
  },
  legend: {
    show: true,
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  xaxis: {
    categories: xAxisNodes,
    tickAmount: 4,
    labels: { style: { fontSize: "8px", colors: "black" } },
  },
  yaxis: {
    tickAmount: 4,
    labels: { formatter: (val) => formatTime(val) },
  },
  tooltip: {
    x: {
      formatter: (_, { dataPointIndex }) => xAxisNodes[dataPointIndex],
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.8,
      opacityFrom: 0.8,
      opacityTo: 0.1,
      stops: [0, 100],
    },
  },
  grid: { borderColor: "#e7e7e7", strokeDashArray: 3 },
});

export const barChartOptions = (
  xAxisNodes: string[],
  yAxisMin: number,
  yAxisMax: number,
  yAxisUnit: string
): ApexOptions => ({
  chart: {
    toolbar: {
      show: false,
    },
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
    active: {
      filter: {
        type: "none",
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "25%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: xAxisNodes,
    labels: {
      rotate: 0,
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    min: yAxisMin,
    max: yAxisMax,
    labels: { formatter: (val) => val + yAxisUnit },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  fill: {
    opacity: 1,
    colors: ["#039BE5", "#BBDEFB"],
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} hrs`,
    },
  },
  grid: {
    borderColor: "#e7e7e7",
  },
  stroke: {
    width: 2,
    colors: ["transparent"],
  },
});

export const stackedBarChartOptions = (
  xAxisNodes: string[],
  yAxisMax?: number,
  isLightMode?: boolean
): ApexOptions => ({
  chart: {
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: false,
    showForSingleSeries: true,
    position: "top",
    horizontalAlign: "right",
    fontSize: "12px",
    labels: {
      colors: "#000", // adjust if dark mode
    },
    markers: {
      size: 6, // Size of the marker
      shape: "circle", // Request circular shape
    },
  },
  colors: ["#039BE5"],
  plotOptions: {
    bar: {
      columnWidth: "40%",
      dataLabels: {
        orientation: "vertical",
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => (val > 0 ? formatTime(val) : ""),
    offsetY: 3,
    style: {
      fontSize: "5px",
      fontWeight: "400",
      colors: isLightMode ? ["black"] : ["#fff"],
    },
  },

  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
    active: {
      filter: {
        type: "none",
      },
    },
  },
  xaxis: {
    categories: xAxisNodes,
    labels: {
      trim: true,
      maxHeight: 40,
      rotate: 0,
      hideOverlappingLabels: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (val) => formatTime(val),
    },
    max: yAxisMax,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    min: 0,
  },
  tooltip: {
    y: {
      formatter: (val) => formatTime(val),
    },
  },

  grid: {
    show: true,
    borderColor: "#e7e7e7",
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
});

export const organisationStackedBarChartOptions = (
  xAxisNodes: string[],
  yAxisMax?: number
): ApexOptions => ({
  ...stackedBarChartOptions(xAxisNodes, yAxisMax),
  dataLabels: { enabled: false },
  plotOptions: {
    bar: {
      columnWidth: "25px",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
});
