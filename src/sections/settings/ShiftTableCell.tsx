import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  CircularProgress,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { EmployeeShiftMappingResult } from "../../services/useEmployeeShiftMappingApi";
import { useUpdateUserShiftMappingApi } from "../../services/useUpdateUserShiftMappingApi";
import { GetShiftsResponse } from "../../services/useGetShiftsApi";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import { DefaultShiftResponse } from "../../services/useDefaultShiftsApi";

interface TableCellProps {
  date: string;
  data: EmployeeShiftMappingResult;
  shiftsData: GetShiftsResponse[] | null;
  fetchEmployeeShiftMapping: VoidFunction;
  defaultShifts: DefaultShiftResponse[] | null;
}

const ShiftTableCell: React.FC<TableCellProps> = ({
  data,
  date,
  shiftsData,
  fetchEmployeeShiftMapping,
  defaultShifts,
}) => {
  const theme = useTheme();
  const { execute, isLoading } = useUpdateUserShiftMappingApi();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [loadingShiftId, setLoadingShiftId] = useState<number | null>(null);

  const formatShiftTime = useCallback((time: string, timeZone: string) => {
    if (!time || !timeZone) return "";
    const [hour, minute, second] = time.split(":");
    const formattedTime = new Date();
    formattedTime.setHours(parseInt(hour, 10));
    formattedTime.setMinutes(parseInt(minute, 10));
    formattedTime.setSeconds(parseInt(second, 10));
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone,
    }).format(formattedTime);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boxRef.current &&
        !boxRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = async (shift: number) => {
    setLoadingShiftId(shift);
    await execute({
      userShiftMapping_id: data.shifts[date].mapping_id || 0,
      userShiftMapping: { shift: shift, date: date, user: data.user_id },
    })
      .then(() => {
        enqueueSnackbar("User Shift updated successfully!", {
          variant: "success",
        });
      })
      .catch((error: any) => {
        console.error("Error updating notifications:", error);
        enqueueSnackbar("Failed to update user shift. Please try again.", {
          variant: "error",
        });
      });
    await fetchEmployeeShiftMapping();
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    setOpen(true);
  };

  const isPastOrToday = moment(date).isSameOrBefore(moment(), "day");

  const assignedShift = useMemo(() => {
    const currentShift = data.shifts[date];

    if (currentShift && currentShift.shift_id) {
      return currentShift;
    }

    const dayName = moment(date).format("dddd");

    const defaultShift =
      defaultShifts?.find((shift) => shift.work_week.includes(dayName)) || null;

    return defaultShift
      ? {
          ...defaultShift,
          shift_name: defaultShift.name,
          shift_start_time: defaultShift.start_time,
          shift_end_time: defaultShift.end_time,
          shift_timezone: defaultShift.time_zone,
          shift_is_week_off: defaultShift.is_week_off,
          holiday: null,
          mapping_id: null,
        }
      : null;
  }, [data.shifts, date, defaultShifts]);


  const isHoliday = assignedShift?.holiday || assignedShift?.shift_is_week_off;

  const shiftTime = `${formatShiftTime(
    assignedShift?.shift_start_time?.toString() || "",
    assignedShift?.shift_timezone || ""
  )} - ${formatShiftTime(
    assignedShift?.shift_end_time?.toString() || "",
    assignedShift?.shift_timezone || ""
  )}`;

  return (
    <div ref={boxRef}>
      <Box
        onClick={isPastOrToday ? undefined : handleClick}
        sx={{
          backgroundColor: isHoliday
            ? "rgba(255, 125, 125, 0.2)"
            : "transparent",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "center",
          margin: "-6px -16px",
          padding: "12px 16px",
          cursor: isPastOrToday ? "text" : "pointer",
        }}
      >
        {isHoliday ? (
          <>
            <Typography variant="body1" sx={{ fontWeight: 400 }}>
              {assignedShift?.holiday ? "Holiday" : "Week Off"}
            </Typography>
            <Typography variant="body2" color="grey.900">
              {assignedShift?.holiday || shiftTime}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ fontWeight: 400 }}>
              {assignedShift?.shift_name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(168, 168, 168, 1)"
                    : "rgba(85, 85, 85, 1)",
              }}
            >
              {shiftTime}
            </Typography>
          </>
        )}
      </Box>

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "auto", maxHeight: "375px" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => setOpen(false)}
        ref={popoverRef}
        disableRestoreFocus
      >
        {shiftsData?.map((shift, index) => (
          <>
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                alignItems: "start",
                padding: "6px 12px",
                minWidth: "200px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f8f9fb",
                },
              }}
              onClick={() => handleUpdate(shift.id)}
            >
              {loadingShiftId === shift.id && isLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    padding: "5px 12px",
                  }}
                >
                  <CircularProgress size={20.5} />
                </Box>
              ) : (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 400 }}>
                    {shift.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555555" }}>
                    {formatShiftTime(shift.start_time, shift.time_zone)} -{" "}
                    {formatShiftTime(shift.end_time, shift.time_zone)}
                  </Typography>
                </>
              )}
            </Box>
            {index < shiftsData.length - 1 && (
              <Box
                sx={{
                  borderBottom: "2px solid #f8f9fb",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              />
            )}
          </>
        ))}
      </Popover>
    </div>
  );
};

export default ShiftTableCell;
