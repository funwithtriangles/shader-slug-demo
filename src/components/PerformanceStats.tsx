import { useEffect, useRef } from "react";
import { performanceMonitor } from "../engine";

export const PerformanceStats = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.appendChild(performanceMonitor.dom);
      performanceMonitor.dom.setAttribute("style", "");
    }

    return () => {
      performanceMonitor.dom.remove();
    };
  }, []);

  return <div ref={ref} style={{ position: "fixed", top: 0, right: 0 }} />;
};
