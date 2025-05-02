import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface EmailNotificationsResponse {
  email_notifications: string[];
}

export const useGetEmailNotificationsApi = (
  tenantId: number | string,
  immediate = true
) => {
  const call = useCallback(async () => {
    const url = API_ENDPOINTS.newSettings.email_notifications(tenantId);
    const response = await axiosInstance.get<
      EmailNotificationsResponse,
      AxiosResponse<EmailNotificationsResponse>
    >(url);
    return response.data;
  }, [tenantId]);

  const { value, isLoading, execute } = useAsync(call, immediate);

  return { isLoading, value, execute };
};
