import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButtonBase } from "./LayoutComponent";
import useDowntimeLogsApi, {
  DowntimeLogsRequestParams,
  DowntimeLogsResult,
} from "../services/useDowntimeLogsApi";
import DateRangePicker, {
  DateRange,
} from "./design-system/date-range/DateRangePicker";
import { convertToDateandTime, getDuration } from "../utils/format";
import GridTable, { Column } from "./design-system/GridTable";
import { SetState } from "../utils/types";
import moment from "moment";

const initialStartOfWeek = moment().startOf("week");
const initialEndOfWeek = moment().endOf("week");

interface DowntimeLogsProps {
  range: DateRange;
  setRange: SetState<DateRange>;
  handleClosePanel?: () => void;
}

const DowntimeLogs: FC<DowntimeLogsProps> = ({
  range,
  setRange,
  handleClosePanel,
}) => {
  const [orderBy, setOrderBy] =
    useState<keyof DowntimeLogsResult>("start_time");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const downtimeLogsApiParams: DowntimeLogsRequestParams = useMemo(
    () => ({
      start_date: range[0]?.format("YYYY-MM-DD") || "",
      end_date: range[1]?.format("YYYY-MM-DD") || "",
      page_size: 50,
      sort_by: orderBy,
      sort_order: order,
    }),
    [range, orderBy, order]
  );

  const { data, reset, error, hasMore, next, isLoading } = useDowntimeLogsApi(
    downtimeLogsApiParams,
    true
  );

  const handleSort = useCallback(
    (column: keyof DowntimeLogsResult) => {
      setOrder(orderBy === column && order === "asc" ? "desc" : "asc");
      setOrderBy(column);
      reset();
    },
    [order, orderBy, reset]
  );

  const handleReset = useCallback(() => {
    setRange([initialStartOfWeek, initialEndOfWeek]);
    reset();
  }, [reset, setRange]);

  const handleDateRangeChange = useCallback(
    (value: DateRange) => {
      setRange(value);
      reset();
    },
    [reset, setRange]
  );

  const isResetDisabled =
    range[0]?.isSame(initialStartOfWeek, "day") &&
    range[1]?.isSame(initialEndOfWeek, "day");

  const columns: Column<DowntimeLogsResult>[] = [
    {
      field: "start_time",
      title: "Start",
      sortable: true,
      sticky: true,
      component: (row: any) => (
        <Typography variant="body1">
          {row.start_time ? convertToDateandTime(row.start_time) : ""}
        </Typography>
      ),
    },
    {
      field: "end_time",
      title: "End",
      sortable: true,
      sticky: true,
      component: (row: any) => (
        <Typography variant="body1">
          {row.end_time ? convertToDateandTime(row.end_time) : ""}
        </Typography>
      ),
    },
    {
      field: "duration",
      title: "Duration",
      sortable: true,
      sticky: true,
      component: (row: any) => (
        <Typography variant="body1">
          {getDuration(row.start_time, row.end_time)}
        </Typography>
      ),
    },
  ];
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.mode === "dark" ? "#303038" : "#F5F5F5",
      }}
      height="100%"
    >
      <Box
        p={3}
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#eeeeee" : "#0f1515",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="600">
            Downtime Logs
          </Typography>
          <IconButtonBase onClick={handleClosePanel}>
            <CloseIcon />
          </IconButtonBase>
        </Stack>
        <Stack direction={{ lg: "row" }} gap={2} alignItems="center" mt={3}>
          <Typography variant="body2">Select Date Range</Typography>
          <DateRangePicker 
            value={range} 
            forcedBackgroundColor="#ffffff"
            height="31px"
            border 
            onChange={handleDateRangeChange} 
          />
          <Button
            variant="contained"
            onClick={handleReset}
            disabled={isResetDisabled}
          >
            Reset
          </Button>
        </Stack>
      </Box>
      <Box>
        <GridTable
          columns={columns}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          order={order}
          setOrder={setOrder}
          handleSort={(column) => handleSort(column)}
          data={data}
          error={error}
          hasMore={hasMore}
          loadMore={next}
          sx={{ minHeight: "480px", maxHeight: "calc(100vh - 150px)" }}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default DowntimeLogs;
