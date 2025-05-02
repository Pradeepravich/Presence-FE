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

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

export type DateRange = [Moment | null, Moment | null];

interface WeekPickerProps
  extends Omit<
    DatePickerProps<PickerValidDate, boolean>,
    "onChange" | "value"
  > {
  value: DateRange | null;
  onChange: (value: DateRange) => void;
  backgroundColor?: string;
  testId?: string;
  height?: string; 
}

const WeekPicker = ({
  value,
  onChange,
  backgroundColor,
  testId = "",
  height = "33px", 
  ...restProps
}: WeekPickerProps) => {
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

  const handleToolbarAction = (start: Moment | null, end: Moment | null) => {
    setStartDate(start);
    setEndDate(end);
    selectAndCloseCalendar(start, end);
  };

  const handleDateChange = (date: Moment | null) => {
    const _start = date?.clone()?.startOf("week") || null;
    const _end = date?.clone()?.endOf("week") || null;
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
  const isCurrentWeek = startDate?.isSame(moment(), "week");

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
          onChange={handleDateChange}
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(day) =>
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][day.day()]
          }
          slotProps={{
            textField: {
              size: "small",
              sx: {
                ...commonPickerTextFieldSx,
                backgroundColor: bgColor,
                width: isCurrentWeek ? "300px" : "230px",
                height,
                "& .MuiInputBase-root": {
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                },
              },
              inputProps: {
                value: `${isCurrentWeek ? "This week ( " : ""}${
                  startDate ? startDate.format("DD MMM") : "DD MMM"
                } - ${endDate ? endDate.format("DD MMM YYYY") : "DD MMM YYYY"}${
                  isCurrentWeek ? ")" : ""
                }`,
              },
            },
          }}
          slots={{
            day: (day) => (
              <Day startDate={startDate} endDate={endDate} {...day} />
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
          }}
          {...restProps}
          data-testid={testId}
        />
      </LocalizationProvider>
    </DateRangePickerWrapper>
  );
};

export default WeekPicker;
