import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { Projects } from "./useProjectsApi";

export interface EditShiftRequest {
  name: string;
  time_zone: string;
  start_time: string;
  end_time: string;
  is_deleted: boolean;
  default_shift: boolean;
  is_week_off: boolean;
  work_week: string[];
}

export const useEditShiftApi = () => {
  const call = useCallback(
    async (params?: { shift_id: string | null; shift: EditShiftRequest }) => {
      const response = await axiosInstance.put<
        Projects,
        AxiosResponse<Projects>,
        EditShiftRequest
      >(
        `${API_ENDPOINTS.newSettings.shifts}${params?.shift_id}/`,
        params?.shift
      );
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
