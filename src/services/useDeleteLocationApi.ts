import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export const useDeleteLocationApi = (immediate = true) => {
  const call = useCallback(async (id?: number) => {
    const response = await axiosInstance.delete<
      DefaultAPIResponse,
      AxiosResponse<DefaultAPIResponse>
    >(`${API_ENDPOINTS.newSettings.locations}${id}/`);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, deleteLocation: execute };
};
