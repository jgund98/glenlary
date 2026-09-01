"use client";

import { useEffect, useRef } from "react";

/**
 * Oversized display word floating behind a section, drifting slowly with
 * scroll for depth. Purely decorative.
 */
export default function GhostWord({
  text,
  className = "",
  drift = 60,
}: {
  text: string;
  className?: string;
  drift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / (vh + r.height)));
      el.style.transform = `translateY(${(p - 0.5) * -2 * drift}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [drift]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute select-none font-display italic leading-none ${className}`}
    >
      {text}
    </div>
  );
}
