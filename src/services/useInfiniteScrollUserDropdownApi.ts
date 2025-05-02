import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";
import { AxiosResponse } from "axios";
import { useCallback } from "react";

interface UserDropdown {
  id: number;
  name: string;
  department?: string | null;
}

interface UserDropdownResponse {
  next: string | null;
  count: number;
  results: UserDropdown[];
}

export const useInfiniteScrollUserDropdownApi = (
  params: Record<string, any>,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<
        UserDropdownResponse,
        AxiosResponse<UserDropdownResponse>
      >(API_ENDPOINTS.users.dropdown, { params: queryParams }),
    []
  );

  return useInfiniteScrollApi<UserDropdown, UserDropdownResponse>({
    fetchData,
    params,
    immediate,
  });
};
