import { useCallback } from "react";
import useAsync from "../hooks/useAsync";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/constants";
import { AxiosResponse } from "axios";

export interface EmailNotificationsRequest {
  tenant_id: number | string;
  email_notifications: string[];
}
export interface EmailNotificationsResponse {
  success: boolean;
  message?: string;
}
export const useEmailNotificationsApi = () => {
  const call = useCallback(
    async (
      params: EmailNotificationsRequest = {
        tenant_id: "",
        email_notifications: [],
      }
    ) => {
      const { tenant_id, email_notifications } = params;

      const url = API_ENDPOINTS.newSettings.email_notifications(tenant_id);

      const response = await axiosInstance.post<
        EmailNotificationsResponse,
        AxiosResponse<EmailNotificationsResponse>
      >(url, { email_notifications });

      return response.data;
    },
    []
  );
  const { value, isLoading, execute } = useAsync(call, false);
  return { isLoading, value, postNotifications: execute };
};
