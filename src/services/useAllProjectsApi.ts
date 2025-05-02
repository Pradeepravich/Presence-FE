import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useAsync from "../hooks/useAsync";

export interface ProjectDropdownItem {
  id: number;
  name: string;
}

export const useAllProjectsApi = (
  isReporteeProjectsNeeded: boolean = false,
  isimmediate: boolean = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      ProjectDropdownItem[],
      AxiosResponse<ProjectDropdownItem[]>
    >(API_ENDPOINTS.newSettings.allProjects, {
      params: { isReporteeProjectsNeeded },
    });
    return response.data;
  }, [isReporteeProjectsNeeded]);

  const { value, isLoading, execute } = useAsync(call, isimmediate);

  return { isLoading, value, fetchTenantData: execute };
};
