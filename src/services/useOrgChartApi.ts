import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface UsersRequestParams {
  manager_id?: number | null;
}

export interface OrgChartUser {
  department: string;
  id: number;
  job_title: string;
  manager_internal_id: number | null;
  name: string;
  profile_picture: string;
  reportee_count: number;
  status: string;
}

export const useOrgChartApi = () => {
  const call = useCallback(async (params?: UsersRequestParams) => {
    const response = await axiosInstance.get<
      OrgChartUser[],
      AxiosResponse<OrgChartUser[]>
    >(API_ENDPOINTS.users.orgChart, { params });
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, fetchOrgChartData: execute };
};
