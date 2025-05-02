import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { LoginResponseUser } from "./useMSLoginApi";

interface MSRegisterRequest {
  code: string;
}

interface MSRegisterResponse extends DefaultAPIResponse {
  access_token: string;
  refresh_token: string;
  user: LoginResponseUser;
}

export const useMSRegisterApi = (code: string) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.post<
      MSRegisterResponse,
      AxiosResponse<MSRegisterResponse>,
      MSRegisterRequest
    >(API_ENDPOINTS.auth.register, { code });
    return response.data;
  }, [code]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, registerUser: execute };
};
