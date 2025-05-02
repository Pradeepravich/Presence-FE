import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface PresenceRequestParams {
  date: string;
  departments?: string;
  user_ids?: string; //  (comma-separated IDs)
  availability: "active" | "idle";
  locations?: string;
  shifts?: string;
  projects?: string;
  timezone: string;
  sort?: string;
}

interface HourlyData {
  [hour: string]: number; // Example: { "09:00": 30, "10:00": 45 }
}

export interface PresenceResult {
  id: number;
  name: string;
  email?: string;
  profile_picture: string;
  department?: string;
  user_id?: number;
  total_time: number;
  hourly_data: HourlyData;
  latest_availability?: string; // "active" or "idle"
  status?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  shift_hours: string[]; // ["12:00", "13:00", "14:00"]
  shift_minutes: number; // 180 for 3 hours of shift
}

interface PresenceResponse {
  count: number;
  next?: string;
  results: PresenceResult[];
}

import moment from "moment";

export const generateShiftHours = (
  shiftStartTime?: string,
  shiftEndTime?: string
): string[] => {
  if (!shiftStartTime || !shiftEndTime) return [];

  const start = moment(shiftStartTime);
  const end = moment(shiftEndTime);
  const shiftHours: string[] = [];

  while (start.isBefore(end) || start.isSame(end, "hour")) {
    shiftHours.push(start.format("HH:00")); // 24-hour format "HH:mm"
    start.add(1, "hour");
  }

  return shiftHours.slice(1);
};

export const generateShiftMinutes = (
  shiftStartTime?: string,
  shiftEndTime?: string
): number => {
  if (!shiftStartTime || !shiftEndTime) return 0;

  const start = moment(shiftStartTime);
  const end = moment(shiftEndTime);

  return Math.max(0, end.diff(start, "minutes")); // Difference in minutes
};

const useInfiniteScrollPresenceApi = (
  params: PresenceRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    async (queryParams?: Record<string, any>) => {
      const data = await axiosInstance.get<
        PresenceResponse,
        AxiosResponse<PresenceResponse>
      >(API_ENDPOINTS.analytics.presence, { params: queryParams });
      data.data.results = data.data.results.map((i) => ({
        ...i,
        shift_hours: generateShiftHours(i.shift_start_time, i.shift_end_time),
        shift_minutes: generateShiftMinutes(
          i.shift_start_time,
          i.shift_end_time
        ),
      }));
      return data;
    },

    []
  );

  return useInfiniteScrollApi<PresenceResult, PresenceResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollPresenceApi;
