import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { LoginResponseUser } from "./useMSLoginApi";

interface GetLoggedInUserResponse {
  success: boolean;
  message: string;
  user: LoginResponseUser;
}

export const useGetLoggedinUserApi = () => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      GetLoggedInUserResponse,
      AxiosResponse<GetLoggedInUserResponse>
    >(API_ENDPOINTS.auth.user);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
