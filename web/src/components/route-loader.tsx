"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MoziMark } from "./brand-loader";

/** Keep the veil up at least this long so quick navigations don't flash. */
const MIN_MS = 550;
/** Never leave the veil up if a navigation stalls. */
const FAILSAFE_MS = 8000;

/**
 * Logo veil between internal pages. Shows on a click on a same-site link that leads to another
 * path, and lifts once the new pathname has rendered.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const shownAt = useRef(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      clear();
      shownAt.current = performance.now();
      setShow(true);
      timers.current.push(window.setTimeout(() => setShow(false), FAILSAFE_MS));
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clear();
    };
  }, []);

  // New page is on screen: lift the veil after the minimum time.
  useEffect(() => {
    if (!show) return;
    clear();
    const wait = Math.max(0, MIN_MS - (performance.now() - shownAt.current));
    timers.current.push(window.setTimeout(() => setShow(false), wait));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-hidden={!show}
      className="mz-route fixed inset-0 z-[9998] flex items-center justify-center bg-white transition-opacity duration-300"
      style={{ opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", visibility: show ? "visible" : "hidden", transitionProperty: "opacity, visibility" }}
    >
      <MoziMark className="w-40" />
    </div>
  );
}
