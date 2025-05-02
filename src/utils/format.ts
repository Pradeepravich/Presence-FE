import moment from "moment";
import {
  AnalysisLevelType,
  analysisLevelVal,
  AnalyticsResponse,
  ViewBy,
} from "../services/useAnalyticsApi";
import { round } from "lodash";


export const formatTime = (val: number, isMinNotIncluded?: boolean) => {
  if (val >= 60) {
    const hours = Math.floor(val / 60);
    const minutes = Math.floor(val % 60);
    return minutes > 0
      ? isMinNotIncluded
        ? `${hours}H`
        : `${hours}H ${minutes}M`
      : `${hours}H`;
  }
  return `${Math.floor(val)}M`;
};

export const convertTo2Digits = (value: number): string =>
  value < 10 ? `0${value}` : `${value}`;

export const convertToDateandTime = (value: string) =>
  moment(value).format("D MMM, YYYY h:mm A");

export const getDuration = (start_time: string, end_time: string) => {
  const start = moment(start_time);
  const end = moment(end_time);
  const duration = moment.duration(end.diff(start));
  const minutes = duration.asMinutes();
  if (minutes <= 1) {
    return "5M"; 
  }
return formatTime(minutes + 1);
};

export interface TimelineHour {
  label: string;
  hour24: number;
}

export function generateTimeline(
  startStr: string,
  endStr: string
): TimelineHour[] {
  const start = moment(startStr, "HH:mm:ss").add(1, "hour");
  const end = moment(endStr, "HH:mm:ss");

  if (end.isBefore(start)) {
    end.add(1, "day");
  }

  const result: TimelineHour[] = [];
  const current = start.clone();

  while (current.isSameOrBefore(end)) {
    result.push({
      label: current.format("h A"),
      hour24: current.hour(),
    });
    current.add(1, "hour");
  }

  return result;
}

export const formatDate = (date: string) => {
  return moment(date).format("DD MMM YYYY");
};

export const overViewProps = (
  analysisLevel: AnalysisLevelType,
  viewBy: ViewBy
) => {
  let baseHourlyChartTitle = "";
  let baseStackChartTitle = "";
  let title = "";
  let description = "";
  let stackChartDescription = "";
  let stackChartHeading = "";

  switch (analysisLevel) {
    case analysisLevelVal.org:
      baseHourlyChartTitle = "Hourly average of employees working";
      baseStackChartTitle =
        "Shows the time spent by Team or Departments Working";
      title = "Average time spent by all Employees based on their status";
      description = "Organization Focus Time";
      stackChartDescription = "Average Time spent by Departments";
      stackChartHeading = "Average working hours by time";
      break;

    case analysisLevelVal.dept:
      baseHourlyChartTitle = "Hourly average of employees working";
      baseStackChartTitle = "Shows employee's average time spent Working";
      title = "Average time spent by the Department based on their status";
      description = "Department Focus Time";
      stackChartDescription = "Average Time spent by Department";
      stackChartHeading = "Average  Working Hours spent by Department";
      break;

    case analysisLevelVal.loc:
      baseHourlyChartTitle =
        "Hourly average of employees working in a specific location";
      baseStackChartTitle = "Shows employee's average time spent Working in a specific location ";
      title = "Average time spent by the employees in a location based on their status";
      description = "Location Focus Time";
      stackChartDescription = "Average Time spent by Location wise";
      stackChartHeading = "Average working hours spent by Location wise";
      break;
    case analysisLevelVal.proj:
      baseHourlyChartTitle =
        "Hourly average of employees working in a specific project";
      baseStackChartTitle =
        "Shows employee's average time spent Working in a project";
      stackChartDescription = "Average time spent in project";
      stackChartHeading = `Average Working Hours spent in project`;
      description = "Project Focus Time";
      title =
        "Average Time spent by employees in a project based on their status";
      break;
    case analysisLevelVal.shift:
      baseHourlyChartTitle =
        "Hourly average of employees working ";
      baseStackChartTitle =
        "Shows employee's average time spent Working in a shift";
      stackChartDescription = "Average Working Hours Spent in a shift";
      stackChartHeading = "Average Working Hours spent in shift";
      description = "Shift Focus Time";
      title =
        "Average Time spent by the employees in a shift based on their status";
      break;

    case analysisLevelVal.emp:
      baseHourlyChartTitle = "Hourly average of employee working";      
      baseStackChartTitle = "Shows the employee's average time spent Working";
      stackChartHeading = `${viewBy === "day" ? "" : "Average "}Working Hours spent by employee`;
      stackChartDescription =
        viewBy === "week"
          ? "Time spent by Employee"
          : "Average Time spent by Employee";
      description = "Employee Focus Time";
      title = "Average time spent by Employee based on their status";
      break;

    default:
      return { title: "", description: "" };
  }

  const hourlyChartTitle = `${baseHourlyChartTitle} ${
    viewBy !== "custom" ? `over a ${viewBy}` : "in a selected range"
  }`;
  const stackChartTitle = `${baseStackChartTitle} ${
    viewBy !== "custom" ? `over a ${viewBy}` : "in a selected range"
  }`;

  return {
    title,
    description,
    hourlyChartTitle,
    stackChartTitle,
    stackChartDescription,
    stackChartHeading,
  };
};
export const overViewCardsData = (
  analysisLevel: AnalysisLevelType,
  isTodayOptionSelected: boolean,
  viewBy: ViewBy,
  value?: AnalyticsResponse | null
) => {
  const isEmployeeDayView =
    viewBy === "day" && analysisLevel === analysisLevelVal.emp;
  const inWorkingMode =
    (value?.availability_counts?.Available || 0) +
    (value?.availability_counts?.DoNotDisturb || 0) +
    (value?.availability_counts?.Busy || 0);
  const inIdleMode =
    (value?.availability_counts?.Away || 0) +
    (value?.availability_counts?.BeRightBack || 0) +
    (value?.availability_counts?.Offline || 0);

  return [
    ...(analysisLevel !== analysisLevelVal.emp &&
    viewBy === "day" &&
    isTodayOptionSelected
      ? [
          {
            value: inWorkingMode.toString(),
            mode: "In Working Mode",
            title:
              "Total Employees from Available, Busy and Do Not Disturb status",
            percent: round(
              (inWorkingMode / (inIdleMode + inWorkingMode)) * 100,
              2
            ),
          },
          {
            value: inIdleMode.toString(),
            mode: "In Idle Mode",
            title: "Total Employees from Be Right Back and Away status",
            percent: round(
              (inIdleMode / (inIdleMode + inWorkingMode)) * 100,
              2
            ),
          },
        ]
      : []),
    ...(analysisLevel === analysisLevelVal.emp && viewBy === "day"
      ? []
      : [
          {
            value: formatTime((value?.total_working_hours || 0) * 60),
            mode: isEmployeeDayView ? "Working Time" : "Total Working Time",
            title: analysisLevel === analysisLevelVal.emp ? "Employee spent time in Available, Busy and Do not Disturb Status" : "Total Employees from Available, Busy and Do not Disturb Status",
          },
        ]),

    {
      value: formatTime(value?.summary?.average_working_duration || 0),
      mode: isEmployeeDayView ? "Working Time" : "Average Working Time",
      title: analysisLevel === analysisLevelVal.emp ? `Employee spent time in Available, Busy and Do not Disturb Status ${ !isEmployeeDayView? "in Average" : ""}` : "Total Employees from Available, Busy and Do not Disturb Status in Average",
      percent:
        round(
          ((value?.summary?.average_working_duration ?? 0) /
            ((value?.summary?.average_working_duration ?? 0) +
              (value?.summary?.average_meeting_duration ?? 0))) *
            100,
          2
        ) || 0,
    },
    {
      value: formatTime(value?.summary?.average_meeting_duration || 0),
      mode: isEmployeeDayView ? "Meeting Time" : "Average Meeting Time",
      title: analysisLevel === analysisLevelVal.emp ? `Employee spent time in Busy and Do not Disturb Status ${ !isEmployeeDayView? "in Average" : ""}` : "Total Employees from Busy and Do not Disturb Status in Average",
    },
  ];
};

const departmentColors = [
  "#FBF8CC",
  "#FDE4CF",
  "#FFCFD2",
  "#F1C0E8",
  "#A3C4F3",
  "#90DBF4",
  "#8EECF5",
  "#98F5E1",
  "#B9FBC0",
  "#CB997E",
  "#6B705C",
  "#EDDCD2",
  "#FAD2E1",
  "#99C1DE",
];

export function getDepartmentColor(departmentName: string): string {
  let hash = 0;
  for (let i = 0; i < departmentName.length; i++) {
    hash = departmentName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % departmentColors.length;
  return departmentColors[index];
}
