import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface SyncUsersResponse {
  status: "success" | "error";
  message: string;
}

export const useSyncUsersApi = () => {
  const call = useCallback(async () => {
    const response = await axiosInstance.post<
      SyncUsersResponse,
      AxiosResponse<SyncUsersResponse>
    >(API_ENDPOINTS.users.sync);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
