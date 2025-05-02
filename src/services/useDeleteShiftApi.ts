import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance, { DefaultAPIResponse } from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export const useDeleteShiftApi = () => {
  const call = useCallback(async (params?: { shiftId: string }) => {
    if (!params?.shiftId) {
      throw new Error("Shift ID is required");
    }
    const response = await axiosInstance.delete<
      DefaultAPIResponse,
      AxiosResponse<DefaultAPIResponse>
    >(`${API_ENDPOINTS.newSettings.shifts}${params.shiftId}/`);
    return response.data;
  }, []);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
