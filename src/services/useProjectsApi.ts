import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface ProjectsRequestParams {
  search?: string;
}

interface Admin {
  name: string;
  id: number;
}

interface Employee {
  name: string;
  id: number;
  profile_picture?: string;
}

export interface Projects {
  id: number;
  name: string;
  timezone: string;
  start_date: string;
  end_date: string;
  role: string;
  admins: Admin[];
  employees: Employee[];
}

export interface GetProjectsResponse {
  next?: string;
  count: number;
  results: Projects[];
}

const useInfiniteScrollProjectsApi = (
  params: ProjectsRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<
        GetProjectsResponse,
        AxiosResponse<GetProjectsResponse>
      >(API_ENDPOINTS.newSettings.projects, { params: queryParams }),
    []
  );

  return useInfiniteScrollApi<Projects, GetProjectsResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollProjectsApi;
