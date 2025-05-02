import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface UserDropdownRequestParams {
  page?: number; // Optional query parameter for pagination
  page_size?: number; // Optional query parameter for items per page
  department?: string; // Optional query parameter to filter by department
  query?: string; // Optional query parameter to search by name
  sort?: string;
  isAll?: boolean;
}

export interface UserDropdown {
  id: number; // User ID
  name: string; // User name
  department?: string | null; // User department (nullable)
}

export interface UserDropdownResponse {
  previous: string;
  next: string;
  count: number;
  results: UserDropdown[];
}

export const useUserDropdownApi = (
  params: UserDropdownRequestParams,
  immediate = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      UserDropdownResponse,
      AxiosResponse<UserDropdownResponse>
    >(API_ENDPOINTS.users.dropdown, {
      params,
    });
    return response.data;
  }, [params]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
