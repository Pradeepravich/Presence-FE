import { useState, useCallback, useEffect, useRef } from "react";
import { AxiosResponse } from "axios";

interface InfiniteScrollOptions<T> {
  fetchData: (params: Record<string, any>) => Promise<AxiosResponse<T>>;
  params?: Record<string, any>;
  immediate?: boolean;
  maxErrorRetries?: number;
}

const useInfiniteScrollApi = <T, R extends { results: T[]; count: number }>({
  fetchData,
  params = {},
  immediate = true,
  maxErrorRetries = 3,
}: InfiniteScrollOptions<R>) => {
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);

  const firstLoadDone = useRef(false); // Track first load execution

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || errorCount >= maxErrorRetries) return;

    setIsLoading(true);

    fetchData({ ...params, page })
      .then((response) => {
        setData((prev) =>
          page > 1 ? [...prev, ...response.data.results] : response.data.results
        );
        setCount(response.data.count);
        setHasMore(
          data.length + response.data.results.length < response.data.count
        );
        setError(null);
        setErrorCount(0); // Reset error count on success
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setErrorCount((prev) => prev + 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    hasMore,
    isLoading,
    errorCount,
    maxErrorRetries,
    fetchData,
    params,
    page,
    data.length,
  ]);

  // Execute immediately only once if `immediate` is true
  useEffect(() => {
    if (immediate && !firstLoadDone.current) {
      firstLoadDone.current = true;
      loadMore();
    }
  }, [immediate, loadMore]);

  useEffect(() => {
    if (page > 1) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const next = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setCount(0);
    setPage(1);
    setHasMore(true);
    setError(null);
    setErrorCount(0);
    firstLoadDone.current = false; // Reset first load tracking
  }, []);

  return {
    data,
    count,
    hasMore,
    isLoading,
    error,
    reset,
    errorCount,
    next,
    setPage,
    loadMore,
    setData,
  };
};

export default useInfiniteScrollApi;
