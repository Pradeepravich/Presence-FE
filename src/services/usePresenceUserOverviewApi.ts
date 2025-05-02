import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface UserPresenceOverviewResponse {
  latest_time: string;
  average_times: { [status: string]: number }; // Average time per status
  working_hours: { [hour: string]: number }; // Hourly breakdown
  name: string;
  department: string;
  availability: string;
  profile_picture: string;
  email_id: string;
  timezone: string;
}

export const usePresenceUserOverviewApi = (userId: number) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      UserPresenceOverviewResponse,
      AxiosResponse<UserPresenceOverviewResponse>
    >(API_ENDPOINTS.analytics.overview_user, {
      params: { user_id: userId },
    });

    return response.data;
  }, [userId]);

  const { value, isLoading, execute } = useAsync(call, true);

  return {
    isLoading,
    userPresenceOverview: value,
    fetchUserPresenceOverview: execute,
  };
};
