import React from "react";

interface ErrorFallbackProps {
  resetError?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => {
  const handleReset = () => {
    resetError?.();
    window.location.reload();
  };

  return (
    <div className="error-boundary-fallback">
      <h2>Something went wrong</h2>
      <button onClick={handleReset}>Try again</button>
    </div>
  );
};
