import { useEffect } from "react";
import { errorLogger } from "../utils/logger";

export const useErrorLogging = () => {
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      errorLogger.logError(event.error || new Error(event.message), "window");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorLogger.logError(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        "unhandled"
      );
      event.preventDefault();
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);
};
