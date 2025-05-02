import { useCallback } from "react";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import useInfiniteScrollApi from "../hooks/useInfiniteScrollApi";

export interface DowntimeLogsRequestParams {
  start_date: string;
  end_date: string;
  sort_by?: string; 
  sort_order?: "asc" | "desc"; 
}

export interface DowntimeLogsResult {
  duration: string;
  start_time: string;
  end_time: string;
  id: string;
}

interface DowntimeLogsResponse {
  count: number;
  next?: string;
  results: DowntimeLogsResult[];
}

const sortFieldMap: Record<string, string> = {
  start_time: "start_date",
  end_time: "end_date",
  duration: "duration",
};

const useInfiniteScrollDowntimeLogsApi = (
  params: DowntimeLogsRequestParams,
  immediate = true
) => {
  const fetchData = useCallback((queryParams?: Record<string, any>) => {
    const mappedParams = {
      ...queryParams,
      sort_by: queryParams?.sort_by
        ? sortFieldMap[queryParams.sort_by] || queryParams.sort_by
        : undefined,
      sort_order: queryParams?.sort_order,
    };
  
    return axiosInstance.get<DowntimeLogsResponse, AxiosResponse<DowntimeLogsResponse>>(
      API_ENDPOINTS.downtimelogs,
      { params: mappedParams }
    );
  }, []);

  return useInfiniteScrollApi<DowntimeLogsResult, DowntimeLogsResponse>({
    fetchData,
    params,
    immediate,
  });
};

export default useInfiniteScrollDowntimeLogsApi;
