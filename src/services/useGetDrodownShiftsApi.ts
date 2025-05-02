import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface GetShiftsResponse {
  id: number;
  name: string;
}

export const useGetDropdownShiftsApi = (immediate = true) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      GetShiftsResponse[],
      AxiosResponse<GetShiftsResponse[]>
    >(API_ENDPOINTS.newSettings.dropdwon_shifts);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
