import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface EmployeeShiftMappingRequestParams {
  start_date: string;
  end_date: string;
  sort?: string;
  name?: string;
}

export interface EmployeeShiftMappingResult {
  id: number;
  user_id: number;
  display_name: string;
  profile_picture: string;
  shifts: {
    [date: string]: {
      mapping_id: number;
      shift_id: number;
      shift_timezone: string;
      shift_default: boolean;
      shift_is_week_off: boolean;
      shift_name: string;
      shift_start_time: string;
      shift_end_time: string;
      holiday: string | null;
      work_week: string[];
    };
  };
}

export interface GetEmployeeShiftMappingResponse {
  next?: string;
  count: number;
  results: EmployeeShiftMappingResult[];
}

const useInfiniteScrollEmployeeShiftMappingApi = (
  params: EmployeeShiftMappingRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<
        GetEmployeeShiftMappingResponse,
        AxiosResponse<GetEmployeeShiftMappingResponse>
      >(API_ENDPOINTS.newSettings.employeeShiftMapping, {
        params: queryParams,
      }),
    []
  );

  return useInfiniteScrollApi<
    EmployeeShiftMappingResult,
    GetEmployeeShiftMappingResponse
  >({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollEmployeeShiftMappingApi;
