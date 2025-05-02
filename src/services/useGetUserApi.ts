import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface UserResponse {
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
  mobile_phone: number | null;
}

export const useGetUserApi = () => {
  const call = useCallback(async (params?: { id: string }) => {
    const response = await axiosInstance.get<
      UserResponse,
      AxiosResponse<UserResponse>
    >(`${API_ENDPOINTS.users.allUsers}${params?.id}/`);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
