import { Toaster } from "@/components/ui/sonner";
import "./monitoring.css";
import "./responsive-fixes.css";
import "./route-loading.css";
import "./landing-rebuild.css";
import "./landing-tuning-overrides.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { MonitoringPanel } from "./components/MonitoringPanel";
import { MonitoringProvider } from "./contexts/MonitoringContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const FieldDetail = lazy(() => import("./pages/FieldDetail"));
const Evidence = lazy(() => import("./pages/Evidence"));
const Ledger = lazy(() => import("./pages/Ledger"));

function Router() {
  return (
    <Suspense fallback={<div className="route-loading" role="status" aria-live="polite"><span className="route-loading-mark" aria-hidden="true" /> Loading AgriGuard</div>}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/app"} component={Portfolio} />
        <Route path={"/app/fields/north"} component={FieldDetail} />
        <Route path={"/app/evidence/demo-042"} component={Evidence} />
        <Route path={"/app/ledger"} component={Ledger} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <MonitoringProvider>
        <ThemeProvider
          defaultTheme="light"
          switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
            <MonitoringPanel />
          </TooltipProvider>
        </ThemeProvider>
      </MonitoringProvider>
    </ErrorBoundary>
  );
}

export default App;
