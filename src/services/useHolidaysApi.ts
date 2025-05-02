import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface HolidaysRequestParams {
  search: string;
  page?: number;
  page_size?: number;
}

export interface Holidays {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted?: boolean;
  start_date?: string;
  end_date?: string;
  locations: string[];
  shifts: string;
}

export interface GetHolidaysResponse {
  results: Holidays[];
}

export const useHolidaysApi = (
  params: HolidaysRequestParams,
  immediate = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      GetHolidaysResponse,
      AxiosResponse<GetHolidaysResponse>
    >(API_ENDPOINTS.newSettings.holidays, {
      params: {
        page: params.page,
        page_size: params.page_size,
        search: params.search,
      },
    });
    return response.data;
  }, [params.page, params.page_size, params.search]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
