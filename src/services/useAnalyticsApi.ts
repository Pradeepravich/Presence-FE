import { useCallback, useState } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import moment, { Moment } from "moment";
import { AnalyticUserData } from "../utils/types";

export type ViewBy = "day" | "week" | "month" | "year" | "custom";

export const analysisLevelVal = {
  org: "organization",
  dept: "department",
  proj: "project",
  loc: "location",
  shift: "shift",
  emp: "employee",
} as const;

export type AnalysisLevelType =
  (typeof analysisLevelVal)[keyof typeof analysisLevelVal];

export interface AnalyticsRequestParams {
  view_by: ViewBy;
  analysis_level: AnalysisLevelType;
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  department?: string; // Required if analysis_level = "department"
  user_id?: number; // Required if analysis_level = "employee"
}

export interface TimeSpentByStatus {
  Available: number;
  Busy: number;
  DoNotDisturb: number;
  Away: number;
  BeRightBack: number;
  Offline: number;
  OOO: number;
}

export interface HourlyWorkingAverage {
  [hour: string]: number;
}

export interface Employee {
  id: number;
  name: string;
  profile_picture: string;
  latest_availability: string;
  available_time: number;
}

interface DailyTimeSpent {
  day: string;
  working: number;
  idle: number;
}

interface WeeklyTimeSpent {
  week: string;
  working: number;
  idle: number;
}

interface MonthlyTimeSpent {
  month: string;
  working: number;
  idle: number;
}

type TimeSpentBy<Key extends string> = {
  [P in Key]: string;
} & {
  working: number;
  idle: number;
};
type TimeSpentKeys = "location" | "department" | "shift" | "project";

type AnalyticsResponsetype = {
  [K in TimeSpentKeys as `average_time_spent_by_${K}`]: TimeSpentBy<K>[];
};

export interface AnalyticsResponse
  extends DefaultAPIResponse,
    AnalyticsResponsetype {
  summary: {
    average_working_duration: number;
    average_meeting_duration: number;
    average_idle_time: number;
  };
  average_time_spent_by_status: TimeSpentByStatus;
  hourly_working_average: HourlyWorkingAverage;
  employees: Employee[];
  user: AnalyticUserData;
  average_time_spent_by_day: DailyTimeSpent[];
  average_time_spent_by_week: WeeklyTimeSpent[];
  average_time_spent_by_month: MonthlyTimeSpent[];
  latest_time: string;
  availability_counts: Record<string, number>;
  name: string;
  total_working_hours: number;
}

export const useAnalyticsApi = (params: AnalyticsRequestParams) => {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Moment>(moment());
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      AnalyticsResponse,
      AxiosResponse<AnalyticsResponse>
    >(API_ENDPOINTS.analytics.detailed, { params });

    setLastUpdatedAt(moment());
    return response.data;
  }, [params]);

  const { value, isLoading, execute } = useAsync(call, true);

  return { isLoading, value, fetchAnalytics: execute, lastUpdatedAt };
};
