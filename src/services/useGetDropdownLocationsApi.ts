import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface Locations {
  id: number;
  name: string;
}

export interface LocationsRequestParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export const useGetDropdownLocationsApi = (params: LocationsRequestParams) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      Locations[],
      AxiosResponse<Locations[]>
    >(API_ENDPOINTS.newSettings.dropdown_locations, {
      params: {
        page: params?.page,
        page_size: params?.page_size,
      },
    });
    return response.data;
  }, [params?.page, params?.page_size]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
