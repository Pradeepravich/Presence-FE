import React, { useState, useEffect } from "react";
import { Box, Stack, useTheme } from "@mui/material";

interface WorkWeekProps {
  selectedDays?: string[];
  onChange?: (selectedDays: string[]) => void;
  readOnly?: boolean;
  selectedColor?: string;
}

const WorkWeek: React.FC<WorkWeekProps> = ({
  selectedDays = [],
  onChange,
  readOnly = false,
  selectedColor = "#1976d2",
}) => {
  const [selectedDaysSet, setSelectedDaysSet] = useState<Set<string>>(
    new Set(selectedDays)
  );

  const theme = useTheme();

  useEffect(() => {
    setSelectedDaysSet(new Set(selectedDays));
  }, [selectedDays]);

  const days = [
    { label: "S", value: "Sunday", isWeekend: true },
    { label: "M", value: "Monday", isWeekend: false },
    { label: "T", value: "Tuesday", isWeekend: false },
    { label: "W", value: "Wednesday", isWeekend: false },
    { label: "T", value: "Thursday", isWeekend: false },
    { label: "F", value: "Friday", isWeekend: false },
    { label: "S", value: "Saturday", isWeekend: true },
  ];

  const handleDayClick = (value: string) => {
    if (readOnly) return;

    const newSelectedDays = new Set(selectedDaysSet);
    if (selectedDaysSet.has(value)) {
      newSelectedDays.delete(value);
    } else {
      newSelectedDays.add(value);
    }
    setSelectedDaysSet(newSelectedDays);
    onChange?.(Array.from(newSelectedDays));
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Stack direction="row" spacing={0.5}>
        {days.map((day) => (
          <Box
            key={day.value}
            onClick={() => handleDayClick(day.value)}
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selectedDaysSet.has(day.value)
                ? selectedColor
                : theme.palette.mode === "light"
                ? "rgba(238, 238, 238, 1)"
                : "#3f3e3d",
              color: selectedDaysSet.has(day.value) ? "#ffffff" : "#666666",
              fontSize: "11px",
              fontWeight: 500,
              cursor: readOnly ? "not-allowed" : "pointer",
              pointerEvents: readOnly ? "none" : "auto",
              opacity: 1,
              "&:hover": readOnly
                ? {}
                : {
                    backgroundColor: selectedDaysSet.has(day.value)
                      ? "#039BE5"
                      : "#EEEEEE",
                  },
            }}
          >
            {day.label}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default WorkWeek;
