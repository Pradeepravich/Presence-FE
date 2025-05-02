import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { commonPickerTextFieldSx } from "./styles";
import { DateRange } from "./DateRangePicker";
import useBgColor from "../../../hooks/useBgColor";

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

interface MonthPickerProps {
  value: DateRange | null;
  onChange: (value: DateRange) => void;
  backgroundColor?: string;
  testId?: string;
  height?: string; 
}

const MonthPicker = ({
  value,
  onChange,
  backgroundColor,
  testId = "",
  height = "33px",
}: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Moment | null>(value?.[0] || null);
  const [endDate, setEndDate] = useState<Moment | null>(value?.[1] || null);

  const selectAndCloseCalendar = (start: Moment | null, end: Moment | null) => {
    if (start && !end) {
      end = start.clone();
    }
    onChange([start, end]);
    setOpen(false);
  };

  const handleMonthChange = (date: Moment | null) => {
    const _start = date?.clone()?.startOf("month") || null;
    const _end = date?.clone()?.endOf("month") || null;
    setStartDate(_start);
    setEndDate(_end);
    selectAndCloseCalendar(_start, _end);
  };

  useEffect(() => {
    if (value) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, [value]);

  const { bgColor } = useBgColor(backgroundColor);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        views={["month", "year"]}
        reduceAnimations
        disableFuture
        value={endDate || startDate || null}
        open={open}
        closeOnSelect={false}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleMonthChange}
        onYearChange={() => setOpen(false)}
        slotProps={{
          textField: {
            size: "small",
            sx: {
              ...commonPickerTextFieldSx,
              backgroundColor: bgColor,
              width: "160px",
              height,
              "& .MuiInputBase-root": {
                height: "100%",
                display: "flex",
                alignItems: "center",
              },
            },
          },
        }}
        data-testid={testId}
      />
    </LocalizationProvider>
  );
};

export default MonthPicker;
