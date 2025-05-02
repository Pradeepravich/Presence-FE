import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";
import classNames from "classnames";
import { StyledDayContainer } from "./styled";
import { isInRange } from "../../../utils/date";

interface DayProps extends Omit<PickersDayProps<Moment>, "onClick"> {
  startDate: Moment | null;
  endDate: Moment | null;
  onDateClick?: (date: Moment | null) => void;
}

const Day = ({
  day,
  startDate,
  endDate,
  onDateClick,
  ...pickersDayProps
}: DayProps) => {
  const isHighlighted = isInRange(day, startDate, endDate);
  const isStart = !!startDate?.isSame(day, "day");
  const isEnd = !!endDate?.isSame(day, "day");

  return (
    <StyledDayContainer
      className={classNames({
        "day-start": isStart,
        "day-end": isEnd,
        "day-range": isHighlighted,
        rounded: isStart && isEnd,
        "highlighted-text": isStart || isEnd,
      })}
      key={day.toString()}
    >
      <PickersDay
        {...pickersDayProps}
        day={day}
        onClick={() => onDateClick?.(day)}
      />
    </StyledDayContainer>
  );
};

export default Day;
