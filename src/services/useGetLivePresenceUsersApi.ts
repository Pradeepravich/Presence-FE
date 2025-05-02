import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface PresenceLiveUsersRequestParams {
  availability: string;
  page_size: number;
}

export interface User {
  id: number;
  name: string;
  profile_picture: string;
}

export interface PresenceLiveUsersResponse {
  count: number;
  next?: string;
  results: User[];
}

const useInfiniteScrollLivePresenceUsersApi = (
  params: PresenceLiveUsersRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<
        PresenceLiveUsersResponse,
        AxiosResponse<PresenceLiveUsersResponse>
      >(API_ENDPOINTS.users.livePresenceUser, { params: queryParams }),
    []
  );

  return useInfiniteScrollApi<User, PresenceLiveUsersResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollLivePresenceUsersApi;
