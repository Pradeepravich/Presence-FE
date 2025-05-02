import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { GetShiftsResponse } from "./useGetShiftsApi";

export interface AddShiftsRequest {
  name: string;
  time_zone: string;
  start_time: string;
  end_time: string;
  is_deleted: boolean;
  default_shift: boolean;
  is_week_off: boolean;
  work_week: string[];
}

export const useAddShiftsApi = () => {
  const call = useCallback(async (params?: AddShiftsRequest) => {
    if (!params) {
      throw new Error("Project data is required");
    }
    const response = await axiosInstance.post<
      GetShiftsResponse,
      AxiosResponse<GetShiftsResponse>,
      AddShiftsRequest
    >(API_ENDPOINTS.newSettings.shifts, params);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
