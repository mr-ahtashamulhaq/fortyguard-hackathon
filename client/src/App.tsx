import { Toaster } from "@/components/ui/sonner";
import "./monitoring.css";
import "./responsive-fixes.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { MonitoringPanel } from "./components/MonitoringPanel";
import { MonitoringProvider } from "./contexts/MonitoringContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import FieldDetail from "./pages/FieldDetail";
import Evidence from "./pages/Evidence";
import Ledger from "./pages/Ledger";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/app"} component={Portfolio} />
      <Route path={"/app/fields/north"} component={FieldDetail} />
      <Route path={"/app/evidence/demo-042"} component={Evidence} />
      <Route path={"/app/ledger"} component={Ledger} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
          // switchable
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
