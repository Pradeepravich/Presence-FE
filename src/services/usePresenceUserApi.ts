import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";
import { generateShiftHours, generateShiftMinutes } from "./usePresenceApi";

export interface PresenceUserRequestParams {
  start_date: string;
  end_date: string;
  user_id: number;
  availability?: string; // Comma-separated statuses
}

interface HourlyData {
  [hour: string]: number; // Example: { "09:00": 30, "10:00": 45 }
}

export interface PresenceUserResult {
  name: string;
  date: string;
  total_time: number;
  hourly_data: HourlyData;
  profile_picture: string;
  status?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  shift_hours: string[]; // ["12:00", "13:00", "14:00"]
  shift_minutes: number; // 180 for 3 hours of shift
}

interface PresenceUserResponse {
  count: number;
  next?: string;
  results: PresenceUserResult[];
}

const useInfiniteScrollPresenceUserApi = (
  params: PresenceUserRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(async (queryParams?: Record<string, any>) => {
    const data = await axiosInstance.get<
      PresenceUserResponse,
      AxiosResponse<PresenceUserResponse>
    >(API_ENDPOINTS.analytics.presence_user, { params: queryParams });
    data.data.results = data.data.results.map((i) => ({
      ...i,
      shift_hours: generateShiftHours(i.shift_start_time, i.shift_end_time),
      shift_minutes: generateShiftMinutes(i.shift_start_time, i.shift_end_time),
    }));
    return data;
  }, []);

  return useInfiniteScrollApi<PresenceUserResult, PresenceUserResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollPresenceUserApi;
