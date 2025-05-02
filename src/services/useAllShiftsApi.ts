import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useAsync from "../hooks/useAsync";

export interface ProjectDropdownItem {
  id: number;
  name: string;
}

export const useAllShiftsApi = (
  isReporteeProjectsNeeded: boolean = false,
  isImmediate = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      ProjectDropdownItem[],
      AxiosResponse<ProjectDropdownItem[]>
    >(API_ENDPOINTS.newSettings.allShifts, {
      params: { isReporteeProjectsNeeded },
    });
    return response.data;
  }, [isReporteeProjectsNeeded]);

  const { value, isLoading, execute } = useAsync(call, isImmediate);

  return { isLoading, value, fetchTenantData: execute };
};
