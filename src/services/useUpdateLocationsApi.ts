import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { LocationItem } from "./useGetLocationsApi";

export interface EditLocationRequestParams {
  name: string;
  timezone: string;
  is_deleted: boolean;
  parent: number | null;
}

export const useUpdateLocationsApi = () => {
  const call = useCallback(
    async (params?: { location_id: number; location: LocationItem }) => {
      const response = await axiosInstance.put<
        LocationItem,
        AxiosResponse<LocationItem>,
        EditLocationRequestParams
      >(
        `${API_ENDPOINTS.newSettings.locations}/${params?.location_id}/`,
        params?.location
      );
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
