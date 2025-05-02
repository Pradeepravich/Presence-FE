import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface HolidaysRequestParams {
  search: string;
  page_size: number;
  ordering: string;
  location_id?: number;
}

interface Location {
  id: number;
  name: string;
}

export interface Holidays {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  is_deleted?: boolean;
  start_date?: string;
  end_date?: string;
  locations: Location[];
  shifts: {
    id: number;
    name: string;
  }[];
}

export interface GetHolidaysResponse {
  count: number;
  previous?: string;
  next?: string;
  results: Holidays[];
}

const useInfiniteScrollHolidaysApi = (
  params: HolidaysRequestParams,
  immediate = true
) => {
  const fetchData = useCallback(
    (queryParams?: Record<string, any>) =>
      axiosInstance.get<
        GetHolidaysResponse,
        AxiosResponse<GetHolidaysResponse>
      >(API_ENDPOINTS.newSettings.holidays, { params: queryParams }),
    []
  );

  return useInfiniteScrollApi<Holidays, GetHolidaysResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollHolidaysApi;
