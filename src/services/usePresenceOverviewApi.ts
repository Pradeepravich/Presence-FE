import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface PresenceOverviewResponse {
  latest_time: string;
  counts: {
    [status: string]: number;
  };
  average_times: {
    [status: string]: number;
  };
  working_hours: {
    [hour: string]: number;
  };
}

export const usePresenceOverviewApi = () => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      PresenceOverviewResponse,
      AxiosResponse<PresenceOverviewResponse>
    >(API_ENDPOINTS.analytics.overview);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, true);

  return { isLoading, presenceOverview: value, fetchPresenceOverview: execute };
};
