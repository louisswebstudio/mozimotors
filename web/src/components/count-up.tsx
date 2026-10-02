"use client";

import { useEffect, useRef, useState } from "react";

/** Animates the first number in `value` (e.g. "140+", "24h", "2 min") from 0 when scrolled into view. */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const m = value.match(/\d+/);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    const digits = value.match(/\d+/);
    if (!el || !digits || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(digits[0]);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(Math.max((t - t0) / duration, 0), 1);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setN(0);
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  if (!m) return <span ref={ref}>{value}</span>;
  const shown = n === null ? m[0] : String(n);
  return <span ref={ref}>{value.replace(m[0], shown)}</span>;
}
