import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FormControl, Box, Stack, Typography, useTheme, DialogTitle, IconButton } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import Drawer from "../../components/design-system/Drawer";
import Dropdown from "../../components/design-system/Dropdown";
import { timezoneOptions } from "../../utils/constants";
import TimePicker from "../../components/design-system/TimePicker";
import moment, { Moment } from "moment";
import WorkWeek from "../../components/design-system/WorkWeek";
import { useAddShiftsApi } from "../../services/usePostShiftsApi";
import { useEditShiftApi } from "../../services/useEditShitsApi";
import { useDeleteShiftApi } from "../../services/useDeleteShiftApi";
import PopupButton from "../../components/design-system/PopupButton";
import useConfirm from "../../hooks/useConfirm";
import CloseIcon from "@mui/icons-material/Close";
import { PanelTextField } from "../../components/design-system/PanelTextField";

interface ShiftFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  onSuccess: () => Promise<void>;
  deleteDisabled?: boolean;
  shift?: {
    id?: number;
    name: string;
    timezone: string;
    start_time: string;
    end_time: string;
    work_week?: string[];
    default_shift?: boolean;
    is_week_off?: boolean;
  };
}

interface PanelTitleProps {
  title: string;
  onClose: () => void;
}

export const PanelTitle = ({ title, onClose }: PanelTitleProps) => (
  <DialogTitle
    variant="h4"
    sx={{
      backgroundColor: "grey.700",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: 600,
      height: 50,
    }}
  >
    {title}
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
);

const ShiftForm: React.FC<ShiftFormProps> = ({
  open,
  onClose,
  mode,
  onSuccess,
  shift,
  deleteDisabled,
}) => {
  const theme = useTheme();
  const defaultWorkWeek = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    []
  );

  const [name, setName] = useState(shift?.name || "");
  const [timezone, setTimezone] = useState(shift?.timezone || "");
  const [workWeek, setWorkWeek] = useState<string[]>(
    mode === "edit" ? shift?.work_week || [] : defaultWorkWeek
  );
  const [startTime, setStartTime] = useState<Moment | null>(
    shift?.start_time ? moment(shift.start_time, "HH:mm:ss") : null
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    shift?.end_time ? moment(shift.end_time, "HH:mm:ss") : null
  );

  const [initialValues, setInitialValues] = useState({
    name: shift?.name || "",
    timezone: shift?.timezone || "",
    work_week: shift?.work_week || [],
    start_time: shift?.start_time || "",
    end_time: shift?.end_time || "",
  });

  const { execute: postShift, isLoading: isAddLoading } = useAddShiftsApi();
  const { execute: editShift, isLoading: isEditLoading } = useEditShiftApi();
  const { execute: deleteShift, isLoading: isDeleteLoading } =
    useDeleteShiftApi();

  const { confirm } = useConfirm();

  const resetForm = useCallback(() => {
    setName("");
    setTimezone("");
    setWorkWeek(mode === "edit" ? [] : defaultWorkWeek);
    setStartTime(null);
    setEndTime(null);
  }, [mode, defaultWorkWeek]);

  const handleCloseWithReset = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleChange = useCallback(
    async (
      field: string,
      value: Moment | null | string | number
    ): Promise<void> => {
      if (field === "timezone") {
        setTimezone(value as string);
      }
    },
    []
  );

  useEffect(() => {
    if (open) {
      if (shift) {
        setName(shift.name);
        setTimezone(shift.timezone);
        setWorkWeek(mode === "edit" ? shift.work_week || [] : defaultWorkWeek);
        setStartTime(
          shift.start_time ? moment(shift.start_time, "HH:mm:ss") : null
        );
        setEndTime(shift.end_time ? moment(shift.end_time, "HH:mm:ss") : null);
      } else {
        resetForm();
      }
    }
  }, [shift, mode, defaultWorkWeek, resetForm, open]);

  useEffect(() => {
    if (open && shift && mode === "edit") {
      setInitialValues({
        name: shift.name,
        timezone: shift.timezone,
        work_week: shift.work_week || [],
        start_time: shift.start_time,
        end_time: shift.end_time,
      });
    }
  }, [open, shift, mode]);

  const isFormValid = useMemo(() => {
    return name.trim() !== "" && startTime !== null && endTime !== null;
  }, [name, startTime, endTime]);

  const hasChanges = useMemo(() => {
    if (mode === "add") return true;

    const currentStartTime = startTime?.format("HH:mm:ss") || "";
    const currentEndTime = endTime?.format("HH:mm:ss") || "";

    return (
      name !== initialValues.name ||
      timezone !== initialValues.timezone ||
      currentStartTime !== initialValues.start_time ||
      currentEndTime !== initialValues.end_time ||
      JSON.stringify(workWeek) !== JSON.stringify(initialValues.work_week)
    );
  }, [mode, name, timezone, startTime, endTime, workWeek, initialValues]);

  const handleSave = useCallback(async () => {
    const baseShiftData = {
      name,
      time_zone: timezone,
      start_time: startTime?.format("HH:mm:ss") || "",
      end_time: endTime?.format("HH:mm:ss") || "",
      work_week: workWeek,
      is_deleted: false,
      default_shift: false,
      is_week_off: false,
    };

    try {
      if (mode === "add") {
        await postShift(baseShiftData);
        enqueueSnackbar("Shift added successfully", { variant: "success" });
      } else {
        await editShift({
          shift_id: shift?.id?.toString() || "",
          shift: baseShiftData,
        });
        enqueueSnackbar("Shift updated successfully", { variant: "success" });
      }
      resetForm();
      await onSuccess();
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
      });
      console.error("Error saving shift:", error);
    }
  }, [
    name,
    timezone,
    startTime,
    endTime,
    workWeek,
    mode,
    postShift,
    editShift,
    shift?.id,
    resetForm,
    onSuccess,
  ]);

  const ConfirmDeleteContent = () => (
    <>
      <Typography>
        Are you sure you want to delete{" "}
        <Typography fontWeight="bold" display="inline-block">
          {shift?.name}?
        </Typography>
      </Typography>
      <Typography mt={2}>
        Deleting this Shift will permanently remove all associated data and
        cannot be retrieved later
      </Typography>
    </>
  );

  const handleDelete = async () => {
    if (!shift?.id) return;

    const deleteconfirmed = await confirm({
      title: "Confirm Delete",
      content: <ConfirmDeleteContent />,
      confirmButtonText: "Yes, Delete",
      confirmColor: "error.main",
      cancelColor: "grey.300",
      cancelButtonText: "No, Cancel",
      width: "400px",
    });
    if (!deleteconfirmed) return;
    try {
      await deleteShift({ shiftId: shift?.id.toString() });
      enqueueSnackbar("Shift deleted successfully", { variant: "success" });
      resetForm();
      await onSuccess();
    } catch (error) {
      enqueueSnackbar("Failed to delete shift", { variant: "error" });
      console.error("Error deleting shift:", error);
    }
  };

  const footerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: mode === "edit" ? "space-between" : "center",
      }}
    >
      {mode === "edit" && !deleteDisabled ? (
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
            data-testid="shifts-editshift-delete"
          >
            Delete
          </PopupButton>
          <Stack direction="row" spacing={2}>
            <PopupButton
              onClick={handleSave}
              data-testid="shifts-editshift-save"
              disabled={
                !isFormValid ||
                (mode === "edit" && !hasChanges) ||
                isAddLoading ||
                isEditLoading
              }
              loading={isAddLoading || isEditLoading}
            >
              Save
            </PopupButton>
            <PopupButton
              backgroundColor={theme.palette.grey[300]}
              onClick={handleCloseWithReset}
              data-testid="shifts-editshift-cancel"
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
            disabled={
              !isFormValid ||
              (mode === "edit" && !hasChanges) ||
              isAddLoading ||
              isEditLoading
            }
            loading={isAddLoading || isEditLoading}
            data-testid="shifts-addnew-save"
          >
            Save
          </PopupButton>
          <PopupButton
            backgroundColor={theme.palette.grey[300]}
            onClick={handleCloseWithReset}
            data-testid="shifts-addnew-cancel"
          >
            Cancel
          </PopupButton>
        </Stack>
      )}
    </Box>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={handleCloseWithReset}
        footerContent={footerContent}
        title={mode === "add" ? "Add New Shift" : "Edit Shift"}
      >
        <Stack spacing={3} py={1} px={1}>
          <Box>
            <Typography variant="body1" mb={1} fontWeight={400}>
              Shift Name
            </Typography>
            <PanelTextField
              variant="outlined"
              placeholder="Shift Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography variant="body1" mb={1} fontWeight={400}>
              Time Zone
            </Typography>
            <FormControl
              sx={{
                width: "100%",
              }}
            >
              <Dropdown
                options={timezoneOptions}
                value={timezone}
                onChange={(value) => handleChange("timezone", value)}
                testId="settings-dropdown-timezone"
                forceBackgroundColor={
                  theme.palette.mode === "light" ? "#f6f6f6" : "#434247"
                }
              />
            </FormControl>
          </Box>
          <Stack direction="row" spacing={4} flex={1}>
            <Box sx={{ width: "25%", alignSelf: "stretch" }} flex={1}>
              <Typography variant="body1" mb={1} fontWeight={400}>
                Start Time
              </Typography>
              <FormControl
                sx={{
                  width: "100%",
                  borderRadius: "4px",
                }}
              >
                <TimePicker
                  value={startTime}
                  onAccept={(value: Moment | null) => setStartTime(value)}
                  height="35px"
                />
              </FormControl>
            </Box>
            <Box sx={{ width: "25%" }} flex={1}>
              <Typography variant="body1" mb={1} fontWeight={400}>
                End Time
              </Typography>
              <FormControl
                sx={{
                  borderRadius: "4px",
                  width: "100%",
                }}
              >
                <TimePicker
                  value={endTime}
                  onAccept={(value: Moment | null) => setEndTime(value)}
                  height="35px"
                />
              </FormControl>
            </Box>
          </Stack>
          <Box>
            <Typography variant="body1" mb={1.5} fontWeight={400}>
              Work Week
            </Typography>
            <WorkWeek
              selectedDays={workWeek}
              onChange={setWorkWeek}
              selectedColor={
                mode === "edit" ? "#039BE5" : theme.palette.primary.main
              }
            />
          </Box>
        </Stack>
      </Drawer>
    </>
  );
};

export default ShiftForm;
