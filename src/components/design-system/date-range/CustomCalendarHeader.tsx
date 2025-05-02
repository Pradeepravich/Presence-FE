import React from "react";
import { Button, IconButton } from "@mui/material";
import { Moment } from "moment";
import { DateView } from "@mui/x-date-pickers";
import { SlideDirection } from "@mui/x-date-pickers/DateCalendar/PickersSlideTransition";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

interface CustomCalendarHeaderProps {
  date: Moment;
  onMonthChange: (date: Moment, slideDirection: SlideDirection) => void;
  onViewChange?: (view: DateView) => void;
}

const CustomCalendarHeader: React.FC<CustomCalendarHeaderProps> = ({
  date,
  onMonthChange,
  onViewChange,
}) => {
  const handleMonthOrYearChange = (
    unit: "year" | "month",
    amount: number,
    direction: SlideDirection
  ) => {
    onMonthChange(date.clone().add(amount, unit), direction);
  };

  return (
    <div className="calendar-header-container">
      <IconButton
        onClick={() => handleMonthOrYearChange("year", -1, "left")}
        data-testid="prev-year-btn"
        size="small"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={() => handleMonthOrYearChange("month", -1, "left")}
        data-testid="prev-month-btn"
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>
      <Button
        className="year-label"
        onClick={() => onViewChange?.("month")}
        data-testid="select-year-btn"
        size="small"
      >
        {date.format("MMMM YYYY")}
      </Button>
      <IconButton
        onClick={() => handleMonthOrYearChange("month", 1, "right")}
        data-testid="next-month-btn"
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>
      <IconButton
        onClick={() => handleMonthOrYearChange("year", 1, "right")}
        data-testid="next-year-btn"
        size="small"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

export default CustomCalendarHeader;
