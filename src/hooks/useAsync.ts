import { useCallback, useEffect, useMemo, useState } from "react";

const useAsync = <T, E = string, P = undefined>(
  asyncFunction: (params?: P) => Promise<T>,
  immediate: boolean,
  params?: P
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const isLoading = useMemo(() => status === "pending", [status]);

  const execute = useCallback(
    async (params?: P) => {
      setValue(null);
      setStatus("pending");
      setError(null);
      try {
        const res: T = await asyncFunction(params);
        setValue(res);
        setStatus("success");

        return res;
      } catch (error) {
        setError(error as E);
        setStatus("error");
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute(params);
    }
  }, [execute, immediate, params]);

  return { execute, status, value, error, isLoading, setValue } as const;
};

export default useAsync;
