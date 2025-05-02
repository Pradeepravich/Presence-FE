import { FC, useCallback, useState } from "react";
import Chart from "react-apexcharts";
import { DonutChartOnClickFunc, donutChartOptions } from "./chartProps";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { formatTime } from "../../utils/format";
import { AVAILABILITY_STATUSES } from "../../utils/constants";
import { StyledChartWrapper } from "../design-system/ChartWrapper";

interface Props {
  data: number[];
  legendPosition?: "row" | "column";
  isAverage?: boolean;
}

const DonutChart: FC<Props> = ({ data, legendPosition, isAverage = true }) => {
  const [info, setInfo] = useState<{
    label: string;
    index: number;
  }>({
    label: AVAILABILITY_STATUSES[0].value,
    index: 0,
  });

  const handleDonutChartClick: DonutChartOnClickFunc = useCallback(
    (label: string, index: number) => {
      setInfo({ label, index });
    },
    []
  );

  const isLegendPositionRow = legendPosition === "row";
  const theme = useTheme();
  return (
    <>
      <Box position="relative" m="auto">
        <StyledChartWrapper>
          <Chart
            type="donut"
            options={donutChartOptions(
              handleDonutChartClick,
              theme.palette.mode
            )}
            series={data}
            sx={{ "@media print": { width: "100%" } }}
          />
        </StyledChartWrapper>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          textAlign="center"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h3">{formatTime(data[info.index])}</Typography>
          <Typography variant="subtitle1">
            {AVAILABILITY_STATUSES[info.index].value}
          </Typography>
          {isAverage && (
            <Typography variant="subtitle1">(Average time)</Typography>
          )}
        </Box>
      </Box>
      <Stack
        direction={legendPosition}
        flexWrap="wrap"
            gap={1}
        justifyContent="center"
      >
        {AVAILABILITY_STATUSES.map((stat, index) => (
          <Stack
            key={stat.key}
            direction="row"
            justifyContent="space-between"
            mb={1}
            width={isLegendPositionRow ? "25%" : undefined}
          >
            <Stack direction="row" gap={"4px"} alignItems="center">
              {!isLegendPositionRow ? (
                <Box
                  width={2}
                  height={12}
                  bgcolor={stat.color}
                  borderRadius={2}
                />
              ) : (
                <Box
                  width={10}
                  height={10}
                  borderRadius="50%"
                  bgcolor={stat.color}
                />
              )}
              <Typography variant="caption">
                {isLegendPositionRow ? stat.shortcut : stat.value}
              </Typography>
            </Stack>
            {!isLegendPositionRow && (
              <Typography variant="caption">
                {formatTime(data[index])}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default DonutChart;
