import { useEffect, useRef } from "react";

/**
 * useCronjob - A custom React hook to execute a callback at specific intervals, 3 seconds after the start of the interval.
 *
 * @param callback - The function to be executed periodically.
 * @param intervalMinutes - Interval in minutes for periodic execution.
 */

const useCronjob = (callback: () => void, intervalMinutes: number): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Trigger the callback 5 seconds after the interval starts
      if (currentMinute % intervalMinutes === 0 && currentSecond === 5) {
        callbackRef.current();
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [intervalMinutes]);
};

export default useCronjob;
