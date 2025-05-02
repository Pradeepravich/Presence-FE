import { AxiosResponse } from "axios";
import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";

interface EditProjectRequest {
  user_id: number;
  projects: {
    project_id: number;
    role: string;
  }[];
}

export const useEditProjectsApi = () => {
  const call = useCallback(async (params?: EditProjectRequest) => {
    const response = await axiosInstance.post<
      any,
      AxiosResponse<any>,
      EditProjectRequest
    >(`${API_ENDPOINTS.newSettings.assign_projects}/`, params);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
