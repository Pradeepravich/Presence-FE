import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface AssignShiftsRequest {
  employee_ids: number[];
  shift_id: number;
  start_date: string; // Format: YYYY-MM-DD
  end_date?: string; // Optional, Format: YYYY-MM-DD
}

export const useAssignShiftsApi = () => {
  const call = useCallback(async (params?: AssignShiftsRequest) => {
    const response = await axiosInstance.post<
      void,
      AxiosResponse<void>,
      AssignShiftsRequest
    >(API_ENDPOINTS.newSettings.userShiftMapping, params);

    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, assignShifts: execute };
};
