import { useRef, useEffect, useCallback } from "react";

/**
 * useDebounce hook
 * @param delay Delay in ms
 * @returns A function that accepts a callback and runs it after the delay
 */
export function useDebounce(delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = useCallback(
    (fn: () => void) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn();
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounce;
}
