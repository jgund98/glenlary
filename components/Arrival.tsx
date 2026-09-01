"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * The Arrival: a scroll-driven drive onto the estate.
 * Gates -> the lane past the black barn -> the manor reveal.
 *
 * Opacity/transform are written directly in a rAF scroll handler:
 * framer-motion v13's scroll-linked keyframe opacities freeze
 * intermittently (same bug hit on Bluedoor), so no motion values here.
 */

// piecewise-linear interpolation over keyframe pairs
function ramp(p: number, stops: number[], values: number[]): number {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
}

export default function Arrival() {
  const sectionRef = useRef<HTMLElement>(null);
  const gatesRef = useRef<HTMLDivElement>(null);
  const gatesImgRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const laneImgRef = useRef<HTMLDivElement>(null);
  const manorRef = useRef<HTMLDivElement>(null);
  const manorImgRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let latest = -1;

    const apply = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (p === latest) return;
      latest = p;

      const set = (
        el: HTMLElement | null,
        opacity: number,
        transform?: string
      ) => {
        if (!el) return;
        el.style.opacity = String(opacity);
        if (transform !== undefined) el.style.transform = transform;
        // skip paint work for fully hidden stages
        el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
      };

      set(gatesRef.current, ramp(p, [0, 0.26, 0.36], [1, 1, 0]));
      set(
        gatesImgRef.current,
        1,
        `scale(${ramp(p, [0, 0.36], [1, 1.14])})`
      );
      set(laneRef.current, ramp(p, [0.26, 0.36, 0.58, 0.68], [0, 1, 1, 0]));
      set(
        laneImgRef.current,
        1,
        `scale(${ramp(p, [0.26, 0.68], [1.05, 1.18])})`
      );
      set(manorRef.current, ramp(p, [0.58, 0.68], [0, 1]));
      set(
        manorImgRef.current,
        1,
        `scale(${ramp(p, [0.58, 1], [1.1, 1])})`
      );

      set(
        t1Ref.current,
        ramp(p, [0, 0.2, 0.32], [1, 1, 0]),
        `translateY(${ramp(p, [0, 0.32], [0, -40])}px)`
      );
      set(t2Ref.current, ramp(p, [0.34, 0.44, 0.54, 0.64], [0, 1, 1, 0]));
      set(
        t3Ref.current,
        ramp(p, [0.7, 0.82], [0, 1]),
        `translateY(${ramp(p, [0.7, 0.85], [30, 0])}px)`
      );
      if (t3Ref.current)
        t3Ref.current.style.pointerEvents = p > 0.72 ? "auto" : "none";
      set(cueRef.current, ramp(p, [0, 0.08], [1, 0]));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Arriving at the GlenLary Estate"
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* Stage 1: the gates */}
        <div ref={gatesRef} className="absolute inset-0">
          <div ref={gatesImgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/gates-wreath.jpg"
              alt="The white gates of the GlenLary Estate hung with a wreath"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/45" />
        </div>

        {/* Stage 2: the lane */}
        <div ref={laneRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <div ref={laneImgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/barn-lane.jpg"
              alt="The lane past the black barn and four-board fences"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/50" />
        </div>

        {/* Stage 3: the manor */}
        <div ref={manorRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <div ref={manorImgRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/manor-spring.jpg"
              alt="The Lary Manor across the spring lawn"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/55" />
        </div>

        <div className="grain absolute inset-0" />

        {/* Stage 1 text */}
        <div
          ref={t1Ref}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream"
        >
          <p className="mb-8">
            <span className="tag">
              Paris, Kentucky · A working horse farm since 1840
            </span>
          </p>
          <h1 className="flex flex-col items-center">
            <span className="font-brand -mr-[0.55em] text-base tracking-[0.55em] opacity-90 md:-mr-[0.7em] md:text-xl md:tracking-[0.7em]">
              The
            </span>
            <span className="font-brand -mr-[0.12em] mt-2 text-[13.5vw] font-medium leading-none tracking-[0.12em] sm:text-7xl md:mt-3 md:text-8xl lg:text-[7.5rem]">
              GlenLary
            </span>
            <span className="font-brand -mr-[0.6em] mt-3 text-[5vw] tracking-[0.6em] opacity-95 sm:text-2xl md:-mr-[0.85em] md:mt-5 md:text-3xl md:tracking-[0.85em]">
              Estate
            </span>
          </h1>
        </div>

        {/* Stage 2 text */}
        <div
          ref={t2Ref}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-28 text-center text-cream md:items-center md:pb-0"
        >
          <p
            className="font-display max-w-xl text-3xl font-light italic leading-snug md:text-5xl"
            style={{ textShadow: "0 2px 28px rgba(29,35,28,0.65), 0 1px 8px rgba(29,35,28,0.45)" }}
          >
            Past the black barn, under old trees, along a mile of four-board
            fence&hellip;
          </p>
        </div>

        {/* Stage 3 text */}
        <div
          ref={t3Ref}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-16 text-center text-cream md:pb-24"
        >
          <p
            className="font-display text-4xl font-light italic leading-tight md:text-6xl"
            style={{ textShadow: "0 2px 28px rgba(29,35,28,0.6), 0 1px 8px rgba(29,35,28,0.4)" }}
          >
            &hellip;until the manor comes into view.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/tour"
              className="label btn-fill btn-fill-dark bg-cream px-8 py-4 text-ink"
            >
              Book a Private Tour
            </Link>
            <Link
              href="/estate"
              className="label btn-fill btn-fill-light border border-cream/70 px-8 py-4"
            >
              Wander the Estate
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-cream"
        >
          <span className="label opacity-90">Scroll to make the drive</span>
          <span className="block h-10 w-px animate-pulse bg-cream/70" />
        </div>
      </div>
    </section>
  );
}
