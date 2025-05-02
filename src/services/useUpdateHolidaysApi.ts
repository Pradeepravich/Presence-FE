import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { Holiday } from "./useGetHolidayApi";

export interface EditHolidayRequestParams {
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted?: boolean;
  start_date?: string;
  end_date?: string;
  locations: number[];
  shifts: number[];
}

export const useUpdateHolidaysApi = () => {
  const call = useCallback(
    async (params?: {
      holiday_id: number;
      holiday: EditHolidayRequestParams;
    }) => {
      const response = await axiosInstance.put<
        Holiday,
        AxiosResponse<Holiday>,
        EditHolidayRequestParams
      >(
        `${API_ENDPOINTS.newSettings.holidays}/${params?.holiday_id}/`,
        params?.holiday
      );
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
