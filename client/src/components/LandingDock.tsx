import { FileCheck2, Home, Moon, Orbit, Sun, ThermometerSun } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type DockItem = { label: string; href: string; icon: ReactNode };

function DockButton({ item, mouseX }: { item: DockItem; mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, value => {
    const box = ref.current?.getBoundingClientRect();
    return box ? value - box.left - box.width / 2 : 200;
  });
  const size = useSpring(useTransform(distance, [-130, 0, 130], [38, 58, 38]), { mass: 0.18, stiffness: 280, damping: 18 });
  return (
    <motion.a ref={ref} href={item.href} className="landing-dock-item" style={{ width: size, height: size }} aria-label={item.label}>
      {item.icon}<span>{item.label}</span>
    </motion.a>
  );
}

export function LandingDock() {
  const mouseX = useMotionValue(Infinity);
  const { theme, toggleTheme } = useTheme();
  const items: DockItem[] = [
    { label: "Top", href: "#top", icon: <Home size={17} strokeWidth={1.5} /> },
    { label: "Signal", href: "#signal", icon: <ThermometerSun size={17} strokeWidth={1.5} /> },
    { label: "Policy", href: "#policy", icon: <Orbit size={17} strokeWidth={1.5} /> },
    { label: "Evidence", href: "#evidence", icon: <FileCheck2 size={17} strokeWidth={1.5} /> },
  ];
  return (
    <nav className="landing-dock" aria-label="Landing page navigation" onMouseMove={event => mouseX.set(event.clientX)} onMouseLeave={() => mouseX.set(Infinity)}>
      <span className="landing-dock-brand"><span className="wordmark-mark" />AgriGuard</span>
      <div className="landing-dock-actions">{items.map(item => <DockButton item={item} mouseX={mouseX} key={item.label} />)}</div>
      <button className="landing-dock-theme" type="button" onClick={toggleTheme} aria-label="Toggle color theme">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
      <a className="landing-dock-demo" href="/app">Open demo</a>
    </nav>
  );
}
