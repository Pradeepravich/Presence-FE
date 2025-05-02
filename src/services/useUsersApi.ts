import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface UsersRequestParams {
  name?: string;
  sort?: string;
  location_id?: number;
}

export interface User {
  id: number;
  name: string;
  department?: string | null;
  email: string;
  display_name: string;
  profile_picture: string;
  presence_enabled: boolean;
  is_admin: boolean;
  job_title: string;
  manager_name: string;
  manager_internal_id: string;
  mobile_phone: number | null;
  city: string;
  office_location: string;
  location: { id: number; name: string };
  current_shift: null | { name: string };
  active_projects: { id: number; name: string; role: "Admin" | "Employee" }[];
}

export interface GetUsersResponse {
  next?: string;
  count: number;
  results: User[];
}

const useInfiniteScrollUsersApi = (
  params: UsersRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<GetUsersResponse, AxiosResponse<GetUsersResponse>>(
        API_ENDPOINTS.users.allUsers,
        { params: queryParams }
      ),
    []
  );

  return useInfiniteScrollApi<User, GetUsersResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollUsersApi;
