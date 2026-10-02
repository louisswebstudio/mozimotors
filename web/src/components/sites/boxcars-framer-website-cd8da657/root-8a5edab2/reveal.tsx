"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Framer-style "appear" effect: starts at opacity 0 and translated by (x, y),
 * animates to rest the first time it scrolls into view (0.7s, cubic-bezier(.44,0,.56,1)).
 */
export function Reveal({
  children,
  id,
  className = "",
  y = 24,
  x = 0,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  y?: number;
  x?: number;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--bx-ry": `${y}px`, "--bx-rx": `${x}px`, "--bx-delay": `${delay}s` } as React.CSSProperties;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      data-shown={shown}
      className={`bx-reveal ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
