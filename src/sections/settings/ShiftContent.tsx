import { Box, Typography, Stack, useTheme } from "@mui/material";
import DetailsCard from "../../components/DetailsCard";
import TabNavbar from "../../components/design-system/TabNavbar";
import { useMemo, useState } from "react";
import {
  useGetShiftsApi,
  GetShiftsResponse,
} from "../../services/useGetShiftsApi";
import moment from "moment";
import ShiftForm from "./AddNewShift";
import { timezoneOptions } from "../../utils/constants";
import WorkWeek from "../../components/design-system/WorkWeek";
import CardComponent from "../../components/design-system/Card";

const Shifts = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState<
    GetShiftsResponse | undefined
  >(undefined);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const theme = useTheme();

  const ShiftsApiParams = useMemo(
    () => ({
      page: 1,
      page_size: 10,
    }),
    []
  );

  const {
    value: shiftsData,
    execute: fetchShifts,
    isLoading: isShiftsLoading,
  } = useGetShiftsApi(ShiftsApiParams);

  const filteredShifts = useMemo(() => {
    if (!shiftsData) return [];

    return shiftsData.filter((shift) =>
      shift.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [shiftsData, search]);

  const formatTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("h:mm A");
  };

  const getTimezoneLabel = (value: string) => {
    const option = timezoneOptions.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const handleAddNewClick = () => {
    setFormMode("add");
    setSelectedShift(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (shift: GetShiftsResponse) => {
    setFormMode("edit");
    setSelectedShift(shift);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedShift(undefined);
    setFormMode("add");
  };

  const handleFormSuccess = async () => {
    await fetchShifts();
    handleClose();
  };

  const shiftsWithOutWeekoff = filteredShifts.filter(
    (shift) => !shift.is_week_off
  );

  return (
    <CardComponent
      sx={{ height: "calc(100vh - 170px)", width: "100%", p: "12px 16px" }}
      isLoading={isShiftsLoading}
    >
      <TabNavbar
        title="Shifts"
        onClick={handleAddNewClick}
        onSearch={(value) => setSearch(value)}
        searchPlaceholder="Search shifts..."
      />

      {shiftsWithOutWeekoff.length === 0 && !isShiftsLoading ? (
        <Typography variant="body1" textAlign={"center"} mt={2}>
          No results found
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            mt: 2,
          }}
        >
          {shiftsWithOutWeekoff.map((shift) => (
            <DetailsCard
              title={shift.name}
              subTitle={`${formatTime(shift.start_time)} - ${formatTime(
                shift.end_time
              )}`}
              onEdit={() => handleEditClick(shift)}
            >
              <Stack spacing={3}>
                <Typography
                  variant="body1"
                  noWrap
                  sx={{
                    width: 180,
                    flexShrink: 0,
                    height: "14px",
                  }}
                >
                  {getTimezoneLabel(shift.time_zone)}
                </Typography>
                <WorkWeek
                  selectedDays={shift.work_week || []}
                  readOnly
                  selectedColor={theme.palette.primary.main}
                />
              </Stack>
            </DetailsCard>
          ))}
        </Box>
      )}
      <ShiftForm
        open={isFormOpen}
        onClose={handleClose}
        mode={formMode}
        onSuccess={handleFormSuccess}
        deleteDisabled={selectedShift?.default_shift}
        shift={
          selectedShift
            ? {
                id: selectedShift.id,
                name: selectedShift.name,
                timezone: selectedShift.time_zone,
                start_time: selectedShift.start_time,
                end_time: selectedShift.end_time,
                work_week: selectedShift.work_week || [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                default_shift: selectedShift.default_shift,
                is_week_off: selectedShift.is_week_off,
              }
            : undefined
        }
      />
    </CardComponent>
  );
};

export default Shifts;
