import { useCallback, useEffect, useRef, useState } from "react";
import Worker from "./webWorker?worker";

export const useWorker = () => {
  const worker = useRef<Worker | null>(null);
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: any;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    worker.current = new Worker();
    worker.current.onmessage = (event) => {
      setState({ loading: false, error: null, data: event.data });
    };
    worker.current.onerror = (errorEvent: ErrorEvent) => {
      setState({ loading: false, error: errorEvent.message, data: null });
    };
    return () => {
      worker.current?.terminate();
    };
  }, []);

  const run = useCallback((data: any) => {
    setState({ loading: true, error: null, data: null });
    worker.current?.postMessage(data);
  }, []);

  return { ...state, run };
};
