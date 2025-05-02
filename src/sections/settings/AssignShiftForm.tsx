import { Button, Stack, Typography, useTheme } from "@mui/material";
import { FC, useCallback, useState } from "react";
import Drawer from "../../components/design-system/Drawer";
import { useInfiniteScrollUserDropdownApi } from "../../services/useInfiniteScrollUserDropdownApi";
import { useGetDropdownShiftsApi } from "../../services/useGetDrodownShiftsApi";
import Dropdown from "../../components/design-system/Dropdown";
import moment, { Moment } from "moment";
import DatePicker from "../../components/design-system/date-range/DatePicker";
import { useAssignShiftsApi } from "../../services/useAssignShiftApi";
import SearchableDropdownWithInfiniteScroll from "../../components/design-system/SearchableDropdownWithInfiniteScroll";
import { enqueueSnackbar } from "notistack";

interface User {
  id: number;
  name: string;
  department?: string | null;
}

interface AssignShiftFormProps {
  open: boolean;
  handleClose: VoidFunction;
  refresh: VoidFunction;
}

const AssignShiftForm: FC<AssignShiftFormProps> = ({
  open,
  handleClose,
  refresh,
}) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [shift, setShift] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<User[]>([]);
  const [startDate, setStartDate] = useState<Moment>(moment());
  const [endDate, setEndDate] = useState<Moment>(moment());
  const { value: shifts } = useGetDropdownShiftsApi();
  const {
    data: employeeResults,
    hasMore,
    next,
    isLoading,
    error,
    reset,
  } = useInfiniteScrollUserDropdownApi(
    {
      query: search,
      sort: "name",
      page_size: 30,
    },
    true
  );
  const { isLoading: isAssignLoading, assignShifts } = useAssignShiftsApi();

  const handleEmployeeChange = useCallback(
    (selected: { label: string; value: string }[]) => {
      const selectedEmployeesNew = selected
        .map((selectedEmployee) => {
          const existingEmployee = selectedEmployees.find(
            (employees) => employees.id.toString() === selectedEmployee.value
          );
          if (existingEmployee) {
            return existingEmployee;
          }
          return employeeResults?.find(
            (employee) => employee.id.toString() === selectedEmployee.value
          );
        })
        .filter(Boolean) as User[];

      setSelectedEmployees(selectedEmployeesNew);
    },
    [employeeResults, selectedEmployees]
  );

  const handleDateChange = (
    date: Moment | null,
    setter: (date: Moment) => void
  ) => {
    if (date) {
      setter(date);
    }
  };

  const isFormValid =
    selectedEmployees.length > 0 && shift !== "" && startDate !== null;
  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await assignShifts({
        employee_ids: selectedEmployees.map((emp) => emp.id),
        shift_id: parseInt(shift, 10),
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,
      });
      enqueueSnackbar("User Shift updated successfully", {
        variant: "success",
      });
      handleClose(); // Close drawer on success
      refresh();
      setSearch("");
      setStartDate(moment());
      setEndDate(moment());
      setSelectedEmployees([]);
      setShift("");
    } catch (error) {
      console.error("Error assigning shift:", error);
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
    }
  };

  const close = () => {
    setSearch("");
    setStartDate(moment());
    setEndDate(moment());
    setSelectedEmployees([]);
    setShift("");
    handleClose();
  };

  const footerContent = (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isAssignLoading || !isFormValid}
        color="primary"
      >
        Save
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: "grey.300" }}
        onClick={close}
      >
        Cancel
      </Button>
    </Stack>
  );

  return (
    <Drawer
      title="Assign Shift"
      open={open}
      onClose={close}
      footerContent={footerContent}
    >
      <Stack gap={3} px={1} py={1}>
        <SearchableDropdownWithInfiniteScroll
          label="Select Employees"
          placeholder="Search Employee.."
          options={
            employeeResults?.map((employee) => ({
              label: employee.name,
              value: employee.id.toString(),
            })) || []
          }
          selectedOptions={selectedEmployees.map((employee) => ({
            label: employee.name,
            value: employee.id.toString(),
          }))}
          onSelectionChange={handleEmployeeChange}
          onSearch={(value) => {
            reset();
            setSearch(value);
          }}
          hasMore={hasMore}
          loadMore={next}
          isLoading={isLoading}
          error={error}
        />
        <Stack>
          <Typography mb={1}>Assign Shifts</Typography>
          <Dropdown
            options={
              shifts?.map((s) => ({ label: s.name, value: s.id.toString() })) ||
              []
            }
            onChange={(v) => setShift(v)}
            value={shift}
            forceBackgroundColor={
              theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
            }
          />
        </Stack>
        <Stack direction="row" spacing={3} flex={1}>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1">Start Date</Typography>
            <DatePicker
              width="100%"
              value={startDate}
              onChange={(date) => handleDateChange(date, setStartDate)}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              disableFuture={false}
            />
          </Stack>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1">End Date</Typography>
            <DatePicker
              width="100%"
              value={endDate}
              onChange={(date) => handleDateChange(date, setEndDate)}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              disableFuture={false}
            />
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default AssignShiftForm;
