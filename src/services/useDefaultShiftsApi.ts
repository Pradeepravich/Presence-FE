import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useAsync from "../hooks/useAsync";

export interface DefaultShiftResponse {
  id: number;
  name: string;
  time_zone: string;
  start_time: string;
  end_time: string;
  is_deleted: boolean;
  default_shift: boolean;
  is_week_off: boolean;
  work_week: string;
}

export const useDefaultShiftsApi = (
  isReporteeProjectsNeeded: boolean = false,
  isImmediate = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      DefaultShiftResponse[],
      AxiosResponse<DefaultShiftResponse[]>
    >(API_ENDPOINTS.newSettings.defaultShifts, {
      params: { isReporteeProjectsNeeded },
    });
    return response.data;
  }, [isReporteeProjectsNeeded]);

  const { value, isLoading, execute } = useAsync(call, isImmediate);

  return { isLoading, value, fetchDefaultTenantData: execute };
};
