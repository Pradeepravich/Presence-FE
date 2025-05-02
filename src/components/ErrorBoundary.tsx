import { Component, ErrorInfo, ReactNode } from "react";
import { errorLogger } from "../utils/logger";
import { ErrorFallback } from "./ErrorFallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorLogger.logError(error, "boundary", errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <ErrorFallback resetError={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
