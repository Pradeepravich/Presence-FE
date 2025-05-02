import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface DepartmentResponse {
  departments: string[]; // List of distinct department names
}

export const useDepartmentsApi = (isImmediate = true) => {
  const call = useCallback(async () => {
    const response = await axiosInstance.get<
      DepartmentResponse,
      AxiosResponse<DepartmentResponse>
    >(API_ENDPOINTS.users.departments);
    return response.data.departments;
  }, []);

  const { value, isLoading, execute } = useAsync(call, isImmediate);

  return { isLoading, departments: value, fetchDepartments: execute };
};
