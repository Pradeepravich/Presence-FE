import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { Projects } from "./useProjectsApi";
import { AddProjectsRequest } from "./usePostProjectApi";

export interface EditProjectRequest {
  name: string;
  start_date: string;
  end_date: string;
  admins: number[];
  employees: number[];
}

export const useEditProjectApi = () => {
  const call = useCallback(
    async (params?: {
      project_id: string | null;
      project: AddProjectsRequest;
    }) => {
      const response = await axiosInstance.patch<
        Projects,
        AxiosResponse<Projects>,
        EditProjectRequest
      >(
        `${API_ENDPOINTS.newSettings.projects}${params?.project_id}/`,
        params?.project
      );
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
