import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { LocationItem } from "./useGetLocationsApi";

export interface AddLocationsRequest {
  name: string;
  timezone: string;
  is_deleted: boolean;
  parent: number | null;
}

export const useAddLocationsApi = () => {
  const call = useCallback(async (params?: AddLocationsRequest) => {
    const response = await axiosInstance.post<
      LocationItem,
      AxiosResponse<LocationItem>,
      AddLocationsRequest
    >(API_ENDPOINTS.newSettings.locations, params);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, addLocation: execute };
};
