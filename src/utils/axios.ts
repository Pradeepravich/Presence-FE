import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { enqueueSnackbar } from "notistack";
import { API_URL } from "../config";
import { API_ENDPOINTS, APP_PATHS } from "./constants";
import { errorLogger } from "./logger";

export interface DefaultAPIResponse {
  success: boolean;
  message: string;
}

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL, // Set your base URL from environment variables
  timeout: 30000, // Set timeout for requests
});

// Flag to prevent infinite retry loops
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  <R extends DefaultAPIResponse>(response: AxiosResponse<R>) => {
    // Return response if successful
    return response;
  },
  async (error: AxiosError<DefaultAPIResponse>) => {
    // Early return if error is falsy
    if (!error) return Promise.reject(error);

    // Ensure error is AxiosError
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    // Type guard for response
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!axios.isCancel(error)) {
      console.log(error);
      const msg =
        typeof error.message === "string"
          ? error.message
          : "Unknown Axios error";
      await errorLogger.logError(msg, "unhandled");
    }

    // Check for 401 error
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_URL}${API_ENDPOINTS.auth.refresh}`,
            { refresh_token: refreshToken }
          );

          // Save the new token
          localStorage.setItem("token", data.access_token);
          isRefreshing = false;
          processQueue(null, data.access_token);

          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError as AxiosError, null);

          // Handle refresh token failure
          enqueueSnackbar("Session expired. Please log in again.", {
            variant: "error",
          });
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          // Redirect to login page or handle logout
          window.location.href = APP_PATHS.login;

          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, handle logout
        enqueueSnackbar("Session expired. Please log in again.", {
          variant: "error",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = APP_PATHS.login;
        return Promise.reject(error);
      }
    }

    // Check if the error response exists and has success set to false
    if (
      error.response &&
      error.response.data &&
      error.response.data.success === false
    ) {
      // Display the error message using notistack
      enqueueSnackbar(
        (error.response.data as { message?: string }).message ||
          "An error occurred",
        { variant: "error" }
      );
    }

    // Reject the promise with the error object
    return Promise.reject(error);
  }
);

export default axiosInstance;
