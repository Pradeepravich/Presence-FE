import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Search from "../../components/design-system/Search";
import { useCallback, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import { getSameDayLastWeek } from "../../utils/date";
import DateRangePicker, {
  DateRange,
} from "../../components/design-system/date-range/DateRangePicker";
import GridTable, { Column } from "../../components/design-system/GridTable";
import useEmployeeShiftMappingApi, {
  EmployeeShiftMappingResult,
} from "../../services/useEmployeeShiftMappingApi";
import ShiftTableCell from "./ShiftTableCell";
import { useGetShiftsApi } from "../../services/useGetShiftsApi";
import AssignShiftForm from "./AssignShiftForm";
import CardComponent from "../../components/design-system/Card";
import { useDefaultShiftsApi } from "../../services/useDefaultShiftsApi";

function ShiftMappings() {
  const [orderBy, setOrderBy] =
    useState<keyof EmployeeShiftMappingResult>("display_name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState<Moment | null>(
    getSameDayLastWeek()
  );
  const [endDate, setEndDate] = useState<Moment | null>(moment().endOf("day"));
  const { value: shiftsData } = useGetShiftsApi({ page: 1, page_size: 20 });
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);

  const employeeShiftMappingsParams = useMemo(() => {
    return {
      page_size: 20,
      name: searchName,
      start_date: startDate?.format("YYYY-MM-DD") || "",
      end_date: endDate?.format("YYYY-MM-DD") || "",
      sort: `${order === "asc" ? "" : "-"}${orderBy}`,
    };
  }, [endDate, order, orderBy, searchName, startDate]);

  const { isLoading, data, error, hasMore, reset, next } =
    useEmployeeShiftMappingApi(employeeShiftMappingsParams);


  const {value:defaultShifts} = useDefaultShiftsApi(false, true);  

  const dateRange = useMemo(() => {
    if (!startDate || !endDate || startDate.isAfter(endDate)) return [];
    const dates: string[] = [];
    const currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate, "day")) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "days");
    }
    return dates;
  }, [startDate, endDate]);

  const handleSort = useCallback(
    (column: keyof EmployeeShiftMappingResult) => {
      if (orderBy === column) {
        setOrder(order === "asc" ? "desc" : "asc");
      } else {
        setOrderBy(column);
        setOrder("asc");
      }
      reset();
    },
    [order, orderBy, reset]
  );

  const handleDateRangeChange = useCallback(
    (value: DateRange) => {
      setStartDate(value[0]);
      setEndDate(value[1]);
      reset();
    },
    [reset]
  );

  const columns: Column<any>[] = useMemo(() => {
    const baseColumns: Column<any>[] = [
      {
        field: "display_name",
        title: "Employee Name",
        sortable: true,
        minWidth: 200,
        sticky: true,
        component: (row: EmployeeShiftMappingResult) => (
          <Stack gap={1} direction="row" alignItems="center">
            <Avatar
              src={row.profile_picture}
              alt={row.display_name}
              sx={{ width: 20, height: 20 }}
            />
            <Typography variant="body2">{row.display_name}</Typography>
          </Stack>
        ),
      },
    ];

    const dateColumns = dateRange.map((date) => ({
      field: date,
      title: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Typography variant="body2">
            {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
          </Typography>
          <Typography
            sx={{
              backgroundColor:
                new Date(date).toDateString() === new Date().toDateString()
                  ? "#64B5F64D"
                  : "transparent",
              width: "22px",
              height: "22px",
              borderRadius: "22px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px !important",
            }}
            variant="h1"
          >
            {new Date(date).getDate()}
          </Typography>
        </Box>
      ),
      sortable: false,
      minWidth: 170,
      component: (row: EmployeeShiftMappingResult) => (
        <ShiftTableCell
          data={row}
          date={date}
          fetchEmployeeShiftMapping={reset}
          shiftsData={shiftsData}
          defaultShifts={defaultShifts}
        />
      ),
    }));

    return [...baseColumns, ...dateColumns];
  }, [dateRange, defaultShifts, reset, shiftsData]);

  return (
    <CardComponent sx={{ width: "100%", padding: "0px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        sx={{ padding: "12px 16px" }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="h5" fontWeight="600">
            Employee Shift Mapping
          </Typography>
          <Search
            onChange={(e) => {
              setSearchName(e);
              reset();
            }}
            placeholder="Search"
          />
        </Stack>
        <Stack direction="row" gap={2}>
          <DateRangePicker
            onChange={handleDateRangeChange}
            value={[startDate, endDate]}
            testId="employee-shift-mapping-datepicker"
            disableFuture={false}
            forcedBackgroundColor="transparent"
            height="31px"
            border
          />
          <Button
            variant="contained"
            data-testid="settings-shifts-assign-shift"
            color="primary"
            onClick={() => setIsAssignShiftOpen(true)}
          >
            Assign Shift
          </Button>
          <AssignShiftForm
            handleClose={() => setIsAssignShiftOpen(false)}
            open={isAssignShiftOpen}
            refresh={reset}
          />
        </Stack>
      </Stack>
      <GridTable
        columns={columns}
        handleSort={handleSort}
        isLoading={isLoading}
        data={data}
        sx={{ minHeight: "480px", maxHeight: "calc(100vh - 250px)" }}
        error={error}
        hasMore={hasMore}
        loadMore={next}
        order={order}
        orderBy={orderBy}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
      />
    </CardComponent>
  );
}

export default ShiftMappings;
