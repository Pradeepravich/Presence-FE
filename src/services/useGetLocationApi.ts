import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { LocationItem } from "./useGetLocationsApi";

export const useGetLocationApi = (params: { id: number }, immediate = true) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      LocationItem,
      AxiosResponse<LocationItem>
    >(`${API_ENDPOINTS.newSettings.locations}/${params.id}`);
    return response.data;
  }, [params.id]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
