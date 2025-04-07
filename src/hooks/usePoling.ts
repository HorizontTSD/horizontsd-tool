import { useEffect } from "react";

export const usePolling = <T>(
  fetchFn: () => Promise<T>,
  interval = 5 * 60 * 1000,
  immediate: boolean = true
) => {
  useEffect(() => {
    if (immediate) {
      fetchFn();
    }
    const timerId = setInterval(fetchFn, interval);

    return () => clearInterval(timerId);
  }, [fetchFn, interval, immediate]);
};
