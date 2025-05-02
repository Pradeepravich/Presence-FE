import { RootState } from "../redux/store";
import { store } from "../redux/store";
import axiosInstance, { DefaultAPIResponse } from "./axios";
import { AxiosResponse } from "axios";

interface ErrorLog {
  error: string;
  errorInfo?: React.ErrorInfo;
  type: "boundary" | "window" | "unhandled";
  route: string;
  timestamp: string;
  userId?: string | number;
  tenantId?: string | number;
  browserInfo: {
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
  };
}

interface ErrorLogRequest {
  logs: Array<{
    error: {
      message: string;
    };
    errorInfo?: {
      componentStack: string;
    };
    type: ErrorLog["type"];
    route: string;
    timestamp: string;
    userId?: string | number;
    tenantId?: string | number;
    browserInfo: {
      userAgent: string;
      language: string;
      platform: string;
      screenResolution: string;
    };
  }>;
}

interface ErrorLogResponse extends DefaultAPIResponse {
  logs: Array<{
    id: number;
    error: {
      message: string;
    };
    errorInfo?: {
      componentStack: string;
    };
    type: string;
    route: string;
    timestamp: string;
    userId?: string | number;
    tenantId?: string | number;
    browserInfo: {
      userAgent: string;
      language: string;
      platform: string;
      screenResolution: string;
    };
  }>;
}

const MAX_QUEUE_SIZE = 10; // Maximum number of logs to queue before sending
const CRITICAL_ERROR_TYPES = ["boundary"]; // Error types that trigger immediate flush

const API_ENDPOINT = `/error-logs`;

const getBrowserInfo = () => ({
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
});

const getCurrentRoute = (): string =>
  window.location.pathname + window.location.search;

const formatDate = (date: Date): string => {
  return date.toISOString();
};

const errorLogger = (() => {
  let logQueue: ErrorLog[] = [];
  let isFlushInProgress = false;

  const flushLogs = async (force = false) => {
    // Don't flush if:
    // 1. Queue is empty
    // 2. Flush is already in progress
    // 3. Queue hasn't reached threshold and it's not forced
    if (
      logQueue.length === 0 ||
      isFlushInProgress ||
      (!force && logQueue.length < MAX_QUEUE_SIZE)
    ) {
      return;
    }

    isFlushInProgress = true;
    const logsToSend = [...logQueue];
    logQueue = [];

    try {
      await axiosInstance.post<
        ErrorLogResponse,
        AxiosResponse<ErrorLogResponse>,
        ErrorLogRequest
      >(API_ENDPOINT, {
        logs: logsToSend.map((log) => ({
          ...log,
          error: {
            message: log.error,
          },
          errorInfo: log.errorInfo
            ? {
                componentStack: log.errorInfo.componentStack || "",
              }
            : undefined,
        })),
      });
    } catch (error) {
      // On failure, add logs back to queue but prevent queue from growing too large
      logQueue = [...logsToSend, ...logQueue].slice(0, MAX_QUEUE_SIZE * 2);
      console.error("Failed to send error logs:", error);
    } finally {
      isFlushInProgress = false;
    }
  };

  const logError = async (
    error: Error | string,
    type: ErrorLog["type"],
    errorInfo?: React.ErrorInfo
  ) => {
    // Skip logging if it's an error from the error logging endpoint itself
    if (typeof error === "object" && error.message?.includes("/error-logs")) {
      console.log("Skipping error log for error logger itself:", error.message);
      return;
    }

    // Get user and tenant from Redux store
    const state = store.getState() as RootState;
    const user = state.auth.user;
    const tenant = state.settings.tenant;

    const errorLog: ErrorLog = {
      error: typeof error === "string" ? error : error.message,
      errorInfo,
      type,
      route: getCurrentRoute(),
      timestamp: formatDate(new Date()),
      userId: user?.id,
      tenantId: tenant?.id,
      browserInfo: getBrowserInfo(),
    };

    // Add to queue if not at max size
    if (logQueue.length < MAX_QUEUE_SIZE * 2) {
      logQueue.push(errorLog);
    }

    // Flush immediately only if:
    // 1. It's a critical error type
    // 2. Queue has reached max size
    const shouldFlushImmediately =
      CRITICAL_ERROR_TYPES.includes(type) || logQueue.length >= MAX_QUEUE_SIZE;

    if (shouldFlushImmediately) {
      await flushLogs(true);
    }
  };

  return {
    logError,
  };
})();

// Export the logger
export { errorLogger };
