import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { MS_AUTH_REDIRECT_URI } from "../config";

interface MSLoginRequest {
  code: string;
  redirect_uri: string;
}

export interface LoginResponseUser {
  id: number;
  name: string;
  email: string;
  business_phones: string[];
  display_name: string;
  given_name: string;
  job_title: string;
  mobile_phone: string | null;
  office_location: string;
  preferred_language: string | null;
  surname: string;
  user_principal_name: string;
  user_id: string;
  department: string;
  company_name: string;
  created_on: string;
  updated_on: string;
  is_admin: boolean;
  is_manager: boolean;
  is_project_admin: boolean;
  profile_picture?: string;
}

export interface MSLoginResponse extends DefaultAPIResponse {
  access_token: string;
  refresh_token: string;
  user: LoginResponseUser;
}

export const useMSLoginApi = (code: string) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.post<
      MSLoginResponse,
      AxiosResponse<MSLoginResponse>,
      MSLoginRequest
    >(API_ENDPOINTS.auth.login, { code, redirect_uri: MS_AUTH_REDIRECT_URI });
    return response.data;
  }, [code]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, loginUser: execute };
};
