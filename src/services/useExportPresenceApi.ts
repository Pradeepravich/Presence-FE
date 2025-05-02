import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";

export interface ExportRequestParams {
  date: string;
  department?: string;
  user_ids?: string;
  availability?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export const useExportApi = (params: ExportRequestParams) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<ArrayBuffer>(
      API_ENDPOINTS.analytics.export,
      {
        params,
        responseType: "arraybuffer",
      }
    );
    return response.data;
  }, [params]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, fetchExportData: execute };
};
