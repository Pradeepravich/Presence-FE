import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

interface Tenant {
  id?: number;
  schema_name?: string;
  name?: string;
  created_on?: string;
  timezone: string;
  overtime_threshold: number;
  night_hawks_start: null | string | number;
  night_hawks_end: null | string | number;
  early_birds_start: null | string | number;
  early_birds_end: null | string | number;
  regular_working_hours_end: null | string | number;
  regular_working_hours_start: null | string | number;
  timeline_hours_end: null | string | number;
  timeline_hours_start: null | string | number;
}

export interface EditTenantRequestParams {
  timezone: string;
  overtime_threshold: number;
  night_hawks_start: null | string | number;
  night_hawks_end: null | string | number;
  early_birds_start: null | string | number;
  early_birds_end: null | string | number;
  regular_working_hours_end: null | string | number;
  regular_working_hours_start: null | string | number;
  timeline_hours_end: null | string | number;
  timeline_hours_start: null | string | number;
}

export const useEditTenantApi = () => {
  const call = useCallback(
    async (params?: { tenant_id: string | null; tenant: Tenant }) => {
      const response = await axiosInstance.put<
        Tenant,
        AxiosResponse<Tenant>,
        EditTenantRequestParams
      >(`${API_ENDPOINTS.tenants}${params?.tenant_id}/`, params?.tenant);
      return response.data;
    },
    []
  );

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, execute };
};
