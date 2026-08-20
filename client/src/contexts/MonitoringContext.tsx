import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";

export type MonitoringStage = "idle" | "collecting" | "evaluating" | "recording" | "done" | "error";

type MonitoringContextValue = {
  stage: MonitoringStage;
  isRunning: boolean;
  evidenceCode: string;
  startMonitoring: () => void;
  closeMonitor: () => void;
};

const MonitoringContext = createContext<MonitoringContextValue | null>(null);

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<MonitoringStage>("idle");
  const [evidenceCode, setEvidenceCode] = useState("DEMO-042");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const utils = trpc.useUtils();

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const scenario = trpc.agriGuard.runSyntheticHeatWave.useMutation({
    onSuccess: async (result) => {
      clearTimers();
      setEvidenceCode(result.evidenceCode);
      setStage("done");
      await Promise.all([utils.agriGuard.portfolio.invalidate(), utils.agriGuard.evidence.invalidate(), utils.agriGuard.ledger.invalidate()]);
    },
    onError: () => {
      clearTimers();
      setStage("error");
    },
  });

  const startMonitoring = useCallback(() => {
    if (scenario.isPending) return;
    clearTimers();
    setStage("collecting");
    timers.current = [
      setTimeout(() => setStage("evaluating"), 450),
      setTimeout(() => setStage("recording"), 900),
    ];
    scenario.mutate();
  }, [clearTimers, scenario]);

  const closeMonitor = useCallback(() => {
    clearTimers();
    setStage("idle");
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return <MonitoringContext.Provider value={{ stage, isRunning: scenario.isPending, evidenceCode, startMonitoring, closeMonitor }}>{children}</MonitoringContext.Provider>;
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) throw new Error("useMonitoring must be used inside MonitoringProvider");
  return context;
}
