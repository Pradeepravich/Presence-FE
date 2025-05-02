import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";
import { EmployeeShiftMappingResult } from "./useEmployeeShiftMappingApi";

interface UserShiftMappingRequestParams {
  user: number;
  shift: number;
  date: string;
}

export const useUpdateUserShiftMappingApi = () => {
  const call = useCallback(
    async (params?: {
      userShiftMapping_id: number;
      userShiftMapping: UserShiftMappingRequestParams;
    }) => {
      const response = await axiosInstance.put<
        EmployeeShiftMappingResult,
        AxiosResponse<EmployeeShiftMappingResult>,
        UserShiftMappingRequestParams
      >(
        `${API_ENDPOINTS.newSettings.employeeShiftMapping}${params?.userShiftMapping_id}/`,
        params?.userShiftMapping
      );
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
