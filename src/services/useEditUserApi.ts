import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface User {
  id: number;
  name: string;
  department?: string | null;
  email: string;
  display_name: string;
  profile_picture: string;
  presence_enabled: boolean;
  is_admin: boolean;
}

export interface EditUserResponse {
  previous: string;
  next: string;
  count: number;
  results: User[];
}
export interface EditUserRequest {
  is_admin?: boolean;
  presence_enabled?: boolean;
}

export const useEditUserApi = () => {
  const call = useCallback(
    async (params?: { id: string; user: EditUserRequest }) => {
      const response = await axiosInstance.patch<
        EditUserResponse,
        AxiosResponse<EditUserResponse>,
        EditUserRequest
      >(`${API_ENDPOINTS.users.allUsers}${params?.id}/`, params?.user);
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
