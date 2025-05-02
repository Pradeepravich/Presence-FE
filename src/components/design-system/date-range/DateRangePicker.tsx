import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DatePicker,
  DatePickerProps,
  PickerValidDate,
} from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import CustomCalendarHeader from "./CustomCalendarHeader";
import Layout from "./CustomCalenderLayout";
import Day from "./CustomCalenderDay";
import { DateRangePickerWrapper } from "./styled";
import { commonPickerTextFieldSx } from "./styles";
import useBgColor from "../../../hooks/useBgColor";
import { getSameDayLastWeek } from "../../../utils/date";
import ExpandMoreDownIcon from "../../icons/ExpandMoreDownIcon";
import { useTheme } from "@mui/material";

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

export type DateRange = [Moment | null, Moment | null];

interface DateRangePickerProps
  extends Omit<
    DatePickerProps<PickerValidDate, boolean>,
    "onChange" | "value"
  > {
  value: DateRange | null;
  onChange: (value: DateRange) => void;
  backgroundColor?: string;
  forcedBackgroundColor?: string;
  testId?: string;
  height?: string;
  border?: boolean;
}

const DateRangePicker = ({
  value,
  onChange,
  backgroundColor,
  testId = "",
  height = "33px",
  forcedBackgroundColor,
  border,
  ...restProps
}: DateRangePickerProps) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState<Moment | null>(value?.[0] || null);
  const [endDate, setEndDate] = useState<Moment | null>(value?.[1] || null);
  const [open, setOpen] = useState(false);

  const selectAndCloseCalendar = (start: Moment | null, end: Moment | null) => {
    if (start && !end) {
      end = start.clone();
    }
    onChange([start, end]);
    setOpen(false);
  };

  const handleToolbarAction = (
    start: Moment | null,
    end: Moment | null,
    action: string
  ) => {
    setStartDate(start);
    setEndDate(end);
    if (action !== "reset") {
      selectAndCloseCalendar(start, end);
    } else {
      setStartDate(getSameDayLastWeek());
      setEndDate(moment().endOf("day"));
    }
  };

  const handleDateChange = (date: Moment | null) => {
    if (!startDate || endDate || (date && date.isBefore(startDate, "day"))) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
      selectAndCloseCalendar(startDate, date);
    }
  };

  useEffect(() => {
    if (value) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, [value]);

  const { bgColor } = useBgColor(backgroundColor);

  return (
    <DateRangePickerWrapper>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          views={["month", "year", "day"]}
          reduceAnimations
          disableFuture
          value={endDate || startDate || null}
          closeOnSelect={false}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => selectAndCloseCalendar(startDate, endDate)}
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(day) =>
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][day.day()]
          }
          format={`${startDate?.format("DD MMM YYYY") || "DD MMM YYYY"} - ${
            endDate?.format("DD MMM YYYY") || "DD MMM YYYY"
          }`}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                ...commonPickerTextFieldSx,
                height,
                "& .MuiInputBase-root": {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                },
                backgroundColor: forcedBackgroundColor || bgColor,
                width: "240px",
                border: border
                  ? theme.palette.mode === "light"
                    ? "1.5px solid rgb(0 0 0 / 12%)"
                    : "1.5px solid rgba(168, 168, 168, 1)"
                  : "none",
              },
            },
          }}
          slots={{
            day: (day) => (
              <Day
                startDate={startDate}
                endDate={endDate}
                onDateClick={handleDateChange}
                {...day}
              />
            ),
            calendarHeader: (props) => (
              <CustomCalendarHeader
                date={props.currentMonth}
                onMonthChange={props.onMonthChange}
                onViewChange={props.onViewChange}
              />
            ),
            layout: (prop) => (
              <Layout
                handleToolbarAction={handleToolbarAction}
                startDate={startDate}
                endDate={endDate}
              >
                {prop.children}
              </Layout>
            ),
            openPickerIcon: ExpandMoreDownIcon,
          }}
          {...restProps}
          data-testid={testId}
        />
      </LocalizationProvider>
    </DateRangePickerWrapper>
  );
};

export default DateRangePicker;
