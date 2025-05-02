import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface Holiday {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted?: boolean;
  start_date?: string;
  end_date?: string;
  locations: number[];
  shifts: number[];
}

export interface GetHolidayResponse {
  results: Holiday[];
}

export const useGetHolidayApi = (params: { id: number }, immediate = true) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      GetHolidayResponse,
      AxiosResponse<GetHolidayResponse>
    >(`${API_ENDPOINTS.newSettings.holidays}/${params?.id}`);
    return response.data;
  }, [params?.id]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
