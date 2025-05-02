import React, { useState, useEffect, useMemo } from "react";
import { FormControl, Box, Stack, Typography, useTheme } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Drawer from "../../components/design-system/Drawer";
import PopupButton from "../../components/design-system/PopupButton";
import DatePicker from "../../components/design-system/date-range/DatePicker";
import moment, { Moment } from "moment";
import SearchableDropdown from "../../components/design-system/SearchableDropdown";
import { useGetDropdownShiftsApi } from "../../services/useGetDrodownShiftsApi";
import { useAddHolidaysApi } from "../../services/useAddHolidaysApi";
import { useUpdateHolidaysApi } from "../../services/useUpdateHolidaysApi";
import { useDeleteHolidayApi } from "../../services/useDeleteHolidayApi";
import { getExtremeChildren } from "../../utils/LinearToTreeArrayFormat";
import useGetLocationsApi from "../../services/useGetLocationsApi";
import useConfirm from "../../hooks/useConfirm";
import { PanelTextField } from "../../components/design-system/PanelTextField";

interface HolidayFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  onSuccess: () => Promise<void>;
  holiday?: {
    id?: number;
    name: string;
    start_date: string;
    end_date: string;
    locations: { id: number; name: string }[];
    shifts: { id: number; name: string }[];
  };
}

interface Option {
  label: string;
  value: string;
}

interface InitialValues {
  name: string;
  start_date: string;
  end_date: string;
  locations: { id: number; name: string }[];
  shifts: { id: number; name: string }[];
}

const HolidayForm: React.FC<HolidayFormProps> = ({
  open,
  onClose,
  mode,
  onSuccess,
  holiday,
}) => {
  const [holidayName, setHolidayName] = useState(holiday?.name || "");
  const [startDate, setStartDate] = useState<Moment>(
    holiday?.start_date ? moment(holiday.start_date) : moment()
  );
  const [endDate, setEndDate] = useState<Moment>(
    holiday?.end_date ? moment(holiday.end_date) : moment()
  );
  const [locations, setLocations] = useState<Option[]>(
    holiday?.locations.map((loc) => ({
      label: loc.name,
      value: loc.id.toString(),
    })) || []
  );
  const [shifts, setShifts] = useState<Option[]>(
    holiday?.shifts.map((shift) => ({
      label: shift.name,
      value: shift.id.toString(),
    })) || []
  );
  const [locationSearch, setLocationSearch] = useState("");
  const [shiftSearch, setShiftSearch] = useState("");
  const [initialValues, setInitialValues] = useState<InitialValues>({
    name: holiday?.name || "",
    start_date: holiday?.start_date || "",
    end_date: holiday?.end_date || "",
    locations: holiday?.locations || [],
    shifts: holiday?.shifts || [],
  });
  const theme = useTheme();

  const { execute: addHoliday, isLoading: isAddLoading } = useAddHolidaysApi();
  const { execute: editHoliday, isLoading: isEditLoading } =
    useUpdateHolidaysApi();
  const { execute: deleteHoliday, isLoading: isDeleteLoading } =
    useDeleteHolidayApi();

  const { locations: locationsData } = useGetLocationsApi();
  const { value: shiftsData } = useGetDropdownShiftsApi();

  const { confirm } = useConfirm();

  const officeLocations = useMemo(() => {
    if (!locationsData) return [];
    return getExtremeChildren(locationsData);
  }, [locationsData]);

  const locationsOptions = useMemo(() => {
    if (!officeLocations) return [];

    const filteredLocations = officeLocations.filter((location) =>
      location.name.toLowerCase().includes(locationSearch.toLowerCase())
    );

    return filteredLocations.map((location) => ({
      label: location.name,
      value: location.id.toString(),
    }));
  }, [officeLocations, locationSearch]);

  const shiftsOptions = useMemo(() => {
    if (!shiftsData) return [];

    const filteredShifts = shiftsData.filter((shift) =>
      shift.name.toLowerCase().includes(shiftSearch.toLowerCase())
    );

    return filteredShifts.map((shift) => ({
      label: shift.name,
      value: shift.id.toString(),
    }));
  }, [shiftsData, shiftSearch]);

  const resetForm = () => {
    setHolidayName("");
    setStartDate(moment());
    setEndDate(moment());
    setLocations([]);
    setShifts([]);
    setLocationSearch("");
    setShiftSearch("");
    setInitialValues({
      name: "",
      start_date: "",
      end_date: "",
      locations: [],
      shifts: [],
    });
  };

  const handleLocationSearch = (value: string) => {
    setLocationSearch(value);
  };

  const handleShiftSearch = (value: string) => {
    setShiftSearch(value);
  };

  const handleCloseWithReset = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (holiday) {
      setHolidayName(holiday.name);
      setStartDate(moment(holiday.start_date));
      setEndDate(moment(holiday.end_date));
      setLocations(
        holiday.locations.map((loc) => ({
          label: loc.name,
          value: loc.id.toString(),
        }))
      );
      setShifts(
        holiday.shifts.map((shift) => ({
          label: shift.name,
          value: shift.id.toString(),
        }))
      );
      setInitialValues({
        name: holiday.name,
        start_date: holiday.start_date,
        end_date: holiday.end_date,
        locations: holiday.locations,
        shifts: holiday.shifts,
      });
    } else {
      resetForm();
    }
  }, [holiday]);

  const isFormValid = useMemo(() => {
    return (
      holidayName.trim() !== "" &&
      startDate &&
      endDate &&
      !startDate.isAfter(endDate) &&
      locations.length > 0 &&
      shifts.length > 0
    );
  }, [holidayName, startDate, endDate, locations, shifts]);

  const hasChanges = useMemo(() => {
    if (mode === "add") return true;

    const currentValues = {
      name: holidayName,
      start_date: startDate.format("YYYY-MM-DD"),
      end_date: endDate.format("YYYY-MM-DD"),
      locations: locations.map((loc) => ({
        id: Number(loc.value),
        name: loc.label,
      })),
      shifts: shifts.map((shift) => ({
        id: Number(shift.value),
        name: shift.label,
      })),
    };

    return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
  }, [mode, holidayName, startDate, endDate, locations, shifts, initialValues]);

  const handleSave = async () => {
    try {
      const holidayData = {
        name: holidayName.trim(),
        description: holidayName.trim(),
        is_active: true,
        is_deleted: false,
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        locations: locations.map((loc) => Number(loc.value)),
        shifts: shifts.map((shift) => Number(shift.value)),
      };

      if (mode === "add") {
        await addHoliday(holidayData);
        enqueueSnackbar("Holiday added successfully", { variant: "success" });
      } else if (holiday?.id) {
        await editHoliday({
          holiday_id: holiday.id,
          holiday: holidayData,
        });
        enqueueSnackbar("Holiday updated successfully", { variant: "success" });
      }
      resetForm();
      await onSuccess();
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
      console.error("Error saving holiday:", error);
    }
  };

  const handleDelete = async () => {
    if (!holiday?.id) return;
    const deleteconfirmed = await confirm({
      title: "Confirm Delete",
      content: (
        <div>
          <Typography>
            Are you sure you want to delete{" "}
            <Typography fontWeight="bold" display="inline-block">
              {holiday.name}?
            </Typography>
          </Typography>
          <Typography mt={2}>
            Deleting this Holiday will permanently remove all associated data
            and cannot be retrieved later
          </Typography>
        </div>
      ),
      confirmButtonText: "Yes, Delete",
      confirmColor: "error.main",
      cancelColor: "grey.300",
      cancelButtonText: "No, Cancel",
      width: "400px",
    });
    if (!deleteconfirmed) return;
    try {
      await deleteHoliday({ holidayId: holiday.id.toString() });
      enqueueSnackbar("Holiday deleted successfully", { variant: "success" });
      resetForm();
      await onSuccess();
    } catch (error) {
      enqueueSnackbar("Failed to delete holiday", { variant: "error" });
      console.error("Error deleting holiday:", error);
    }
  };

  const FooterContent = (
    <Box
      sx={{
        justifyContent: mode === "edit" ? "space-between" : "center",
      }}
    >
      {mode === "edit" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <PopupButton
            backgroundColor="#E57373"
            onClick={handleDelete}
            disabled={isDeleteLoading || isEditLoading}
            loading={isDeleteLoading}
            data-testid="settings-holiday-edit-delete"
          >
            Delete
          </PopupButton>
          <Stack direction="row" spacing={2}>
            <PopupButton
              data-testid="settings-holiday-edit-save"
              onClick={handleSave}
              disabled={
                !isFormValid ||
                isAddLoading ||
                isEditLoading ||
                (mode === "edit" ? !hasChanges : false)
              }
              loading={isAddLoading || isEditLoading}
            >
              Save
            </PopupButton>
            <PopupButton
              data-testid="settings-holiday-edit-cancel"
              backgroundColor={theme.palette.grey[300]}
              onClick={handleCloseWithReset}
            >
              Cancel
            </PopupButton>
          </Stack>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          flexDirection="row"
          justifyContent="center"
        >
          <PopupButton
            onClick={handleSave}
            data-testid="settings-holiday-popup-save"
            disabled={
              !isFormValid || isAddLoading || isEditLoading || !hasChanges
            }
            loading={isAddLoading || isEditLoading}
          >
            Save
          </PopupButton>
          <PopupButton
            backgroundColor={theme.palette.grey[300]}
            data-testid="settings-holiday-popup-cancel"
            onClick={handleCloseWithReset}
          >
            Cancel
          </PopupButton>
        </Stack>
      )}
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={handleCloseWithReset}
      footerContent={FooterContent}
      title={mode === "add" ? "Add New Holiday" : "Edit Holiday"}
    >
      <Stack spacing={3} py={1} px={1}>
        <Box>
          <Typography variant="body1" mb={1} fontWeight={400}>
            Holiday Name
          </Typography>
          <FormControl
            sx={{
              width: "100%",
              height: 33,
              borderRadius: "4px",
            }}
          >
            <PanelTextField
              placeholder="Holiday Name"
              variant="outlined"
              fullWidth
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
            />
          </FormControl>
        </Box>

        <Stack direction="row" spacing={3} flex={1}>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1" mb={1} fontWeight={400}>
              Start Date
            </Typography>
            <DatePicker
              width="100%"
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              testId="start-date-picker"
              disableFuture={false}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              shouldDisableDate={(date) => date.isBefore(moment(), "day")}
            />
            {startDate && endDate && startDate.isAfter(endDate) && (
              <Typography color="error" variant="caption">
                Start date cannot be after end date.
              </Typography>
            )}
          </Stack>
          <Stack spacing={1} flex={1}>
            <Typography variant="body1" mb={1} fontWeight={400}>
              End Date
            </Typography>
            <DatePicker
              width="100%"
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              testId="end-date-picker"
              disableFuture={false}
              forcedColor={
                theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
              }
              shouldDisableDate={(date) => date.isBefore(moment(), "day")}
            />
          </Stack>
        </Stack>

        <Box>
          <Typography variant="body1" mb={1} fontWeight={400}>
            Select Location(s)
          </Typography>
          <SearchableDropdown
            options={locationsOptions}
            selectedOptions={locations}
            onSelectionChange={setLocations}
            onSearch={handleLocationSearch}
            placeholder="Search locations..."
          />
        </Box>

        <Box>
          <Typography variant="body1" mb={1} fontWeight={400}>
            Select Shift(s)
          </Typography>
          <SearchableDropdown
            options={shiftsOptions}
            selectedOptions={shifts}
            onSelectionChange={setShifts}
            onSearch={handleShiftSearch}
            placeholder="Search shifts..."
          />
        </Box>
      </Stack>
    </Drawer>
  );
};

export default HolidayForm;
