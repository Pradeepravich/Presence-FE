import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { Moment } from "moment";
import { v4 as uuidv4 } from "uuid";

export interface LeaderboardsRequestParams {
  start_date: Moment | null | undefined | string;
  end_date: Moment | null | undefined | string;
  type: string;
}

interface LeaderboardsResponse {
  user: string;
  date: string;
  total_minutes: number;
  user_name: string;
  profile_pic: string;
  id: string;
}

export const useLeaderboardsApi = (params: LeaderboardsRequestParams) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      LeaderboardsResponse[],
      AxiosResponse<LeaderboardsResponse[]>
    >(API_ENDPOINTS.leaderBoards, {
      params: {
        start_date: params.start_date,
        end_date: params.end_date,
        type: params.type,
      },
    });
    return response.data.map((item) => ({ ...item, id: uuidv4() }));
  }, [params.end_date, params.start_date, params.type]);

  const { value, isLoading, execute } = useAsync(call, true);

  return { isLoading, value, execute };
};
