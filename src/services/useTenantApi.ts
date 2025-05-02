import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface TenantRequestParams {
  tenant_id: string | number | null;
}

interface TenantResponse {
  id: number;
  schema_name: string;
  name: string;
  created_on: string;
  timezone: string;
  overtime_threshold: number;
  night_hawks_start: null | string;
  night_hawks_end: null | string;
  early_birds_start: null | string;
  early_birds_end: null | string;
  regular_working_hours_end: null | string;
  regular_working_hours_start: null | string;
  timeline_hours_end: null | string;
  timeline_hours_start: null | string;
  fetch_presence_in_minutes: number;
}

export const useTenantApi = (params: TenantRequestParams) => {
  const call = useCallback(async () => {
    if (!params?.tenant_id) return null;
    const response = await axiosInstance.get<
      TenantResponse,
      AxiosResponse<TenantResponse>
    >(`${API_ENDPOINTS.tenants}${params.tenant_id}/`);
    return response.data;
  }, [params?.tenant_id]);

  const { value, isLoading, execute } = useAsync(call, false);

  return { isLoading, value, fetchTenantData: execute };
};
