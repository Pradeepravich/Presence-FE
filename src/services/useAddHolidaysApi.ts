import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface AddHolidaysRequest {
  name: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  start_date: string;
  end_date: string;
  locations: number[];
  shifts: number[];
}

interface AddHolidaysResponse extends DefaultAPIResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  is_deleted: boolean;
  start_date: string;
  end_date: string;
  locations: number[];
  shifts: number[];
}

export const useAddHolidaysApi = () => {
  const call = useCallback(async (params?: AddHolidaysRequest) => {
    if (!params) {
      throw new Error("Project data is required");
    }
    const response = await axiosInstance.post<
      AddHolidaysResponse,
      AxiosResponse<AddHolidaysResponse>,
      AddHolidaysRequest
    >(API_ENDPOINTS.newSettings.holidays, params);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
