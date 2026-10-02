"use client";

import { useEffect, useState } from "react";
import { SEEN_KEY } from "./brand-loader-seen";

/** The MoziMotors logo (dark wordmark). CSS reveals it with a left-to-right wipe. */
export function MoziMark({ className = "" }: { className?: string }) {
  return (
    <span className={`mz-mark relative block ${className}`} style={{ aspectRatio: "900 / 198" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mozi-logo-dark.png" alt="" aria-hidden className="mz-logo block h-full w-full" />
    </span>
  );
}

/** Minimum time on screen so the draw animation always finishes. */
const MIN_MS = 1500;
/**
 * Full-screen intro shown once per session on a hard page load, lifted away
 * (clip-path wipe) once the window has loaded. Client-side navigations never
 * remount it.
 */
export function IntroLoader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.mzSeen) {
      setGone(true);
      return;
    }
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const start = performance.now();
    let timer = 0;
    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      timer = window.setTimeout(() => {
        root.style.overflow = "";
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setDone(true);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 1000);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;
  return (
    <div
      role="status"
      aria-label="MoziMotors"
      data-done={done}
      className="mz-intro fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-white"
    >
      <MoziMark className="w-[220px] max-w-[70vw]" />
      <span className="h-[2px] w-[120px] overflow-hidden rounded-full bg-bx-line">
        <span className="mz-bar block h-full w-full bg-bx-navy" />
      </span>
    </div>
  );
}
