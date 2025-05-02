import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface UsersResponse {
  users: {
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
  }[];
}

export const useGetUsersApi = () => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      UsersResponse,
      AxiosResponse<UsersResponse>
    >(API_ENDPOINTS.users.allUsers);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
