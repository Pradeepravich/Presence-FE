import moment, { Moment } from "moment";

export const isInRange = (
  date: Moment,
  startDate: Moment | null,
  endDate: Moment | null
): boolean => {
  if (!startDate || !endDate) return false;
  return date.isBetween(startDate, endDate, "day", "[]");
};

export const isToday = (date: Moment | null) =>
  !date ? false : moment(date).isSame(moment(), "day");

export const getSameDayLastWeek = () =>
  moment().subtract(1, "week").add(1, "day").startOf("day");
