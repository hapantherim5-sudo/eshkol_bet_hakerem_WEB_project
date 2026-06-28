import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION_MS = 3_000;

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  return { toast, showToast };
}
