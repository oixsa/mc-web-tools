'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reusable hook for toast notification state with automatic timer cleanup.
 */
export function useToast(defaultDuration = 2200) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (msg: string, duration = defaultDuration) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToastMessage(msg);
      timerRef.current = setTimeout(() => {
        setToastMessage(null);
        timerRef.current = null;
      }, duration);
    },
    [defaultDuration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    toastMessage,
    showToast,
  };
}
