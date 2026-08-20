import { ThemeToggle } from "@/components/ThemeToggle";
import { useMonitoring } from "@/contexts/MonitoringContext";
import { Activity, ArrowUpRight, BookOpenText, LayoutGrid, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const navItems = [
  { href: "/app", label: "Portfolio", icon: LayoutGrid },
  { href: "/app/evidence/demo-042", label: "Evidence", icon: ShieldCheck },
  { href: "/app/ledger", label: "Ledger", icon: BookOpenText },
];

export function AppShell({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-workspace">
      <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="app-brand-row"><Link href="/"><span className="wordmark"><span className="wordmark-mark" />AgriGuard</span></Link><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
        <p className="app-sidebar-kicker">Wheat heat cover / demo</p>
        <nav className="app-nav">
          {navItems.map(item => {
            const active = location === item.href || (item.href === "/app" && location === "/app/");
            return <Link href={item.href} key={item.href} className={`app-nav-link ${active ? "active" : ""}`}><item.icon size={17} strokeWidth={1.45} />{item.label}</Link>;
          })}
        </nav>
        <div className="app-sidebar-footer"><Activity size={16} strokeWidth={1.5} /><span>Agent control layer</span><small>Policy decisions remain deterministic</small></div>
      </aside>
      <main className="app-main">
        <header className="app-topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <div className="synthetic-pill"><span /> Synthetic demo data</div>
          <div className="app-top-actions"><ThemeToggle />{action}</div>
        </header>
        {children}
      </main>
      {mobileOpen ? <button className="app-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" /> : null}
    </div>
  );
}

export function RunMonitorButton() {
  const { startMonitoring, isRunning } = useMonitoring();
  return <button className="run-monitor-button" onClick={startMonitoring} disabled={isRunning}><span><Activity size={16} strokeWidth={1.6} /></span>{isRunning ? "Monitoring" : "Run monitoring"} <ArrowUpRight size={15} strokeWidth={1.45} /></button>;
}
