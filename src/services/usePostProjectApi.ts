import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { Projects } from "./useProjectsApi";

export interface AddProjectsRequest {
  name: string;
  start_date: string;
  end_date: string;
  admins: number[];
  employees: number[];
}

export const useAddProjectsApi = () => {
  const call = useCallback(async (params?: AddProjectsRequest) => {
    if (!params) {
      throw new Error("Project data is required");
    }
    const response = await axiosInstance.post<
      Projects,
      AxiosResponse<Projects>,
      AddProjectsRequest
    >(API_ENDPOINTS.newSettings.projects, params);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, CreateProject: execute };
};
