import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";

export interface ExportUserPresenceParams {
  user_id: number;
  start_date: string;
  end_date: string;
  availability: string;
}

export const useExportUserPresenceApi = (params: ExportUserPresenceParams) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<ArrayBuffer>(
      API_ENDPOINTS.analytics.export_presence_user,
      {
        params: {
          user_id: params.user_id,
          start_date: params.start_date,
          end_date: params.end_date,
          availability: params.availability,
        },
        responseType: "arraybuffer",
      }
    );
    return response.data;
  }, [params]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, fetchExportUserData: execute };
};
