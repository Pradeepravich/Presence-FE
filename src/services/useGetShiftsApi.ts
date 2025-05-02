import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface ShiftsRequestParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface GetShiftsResponse {
  work_week: string[];
  id: number;
  name: string;
  time_zone: string;
  start_time: string;
  end_time: string;
  is_deleted: boolean;
  default_shift: boolean;
  is_week_off: boolean;
}

export const useGetShiftsApi = (
  params: ShiftsRequestParams,
  immediate = true
) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      GetShiftsResponse[],
      AxiosResponse<GetShiftsResponse[]>
    >(API_ENDPOINTS.newSettings.shifts, {
      params: {
        page: params.page,
        page_size: params.page_size,
      },
    });
    return response.data;
  }, [params?.page, params?.page_size]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
