"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { decodeAll } from "@/lib/predecode";

/**
 * The Arrival: a scroll-driven drive onto the estate.
 * Gates -> down the drive between the fences -> the manor reveal.
 *
 * Two engines, one set of ramps:
 *  - Browsers with CSS scroll-driven animations (Chrome 115+ incl. Android,
 *    Safari/iOS 26+) run it entirely on the compositor. `.arrival` names a view timeline and
 *    the `.arr-*` keyframes in globals.css are bound to it, so the crossfade
 *    tracks the thumb with no main-thread work per frame at all.
 *  - Everywhere else a rAF scroll handler writes the same ramps inline.
 *    (framer-motion v13's scroll-linked keyframe opacities freeze
 *    intermittently, so no motion values here.)
 * The ramps below and the keyframes in globals.css must stay in step.
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
  const panelRef = useRef<HTMLDivElement>(null);
  const gatesRef = useRef<HTMLDivElement>(null);
  const gatesImgRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const laneImgRef = useRef<HTMLDivElement>(null);
  const manorRef = useRef<HTMLDivElement>(null);
  const manorImgRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLParagraphElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  // all three views decoded up front: the first crossfade to the drive or
  // the manor must not wait on a full-screen JPEG decode
  useEffect(() => {
    decodeAll(sectionRef.current);
  }, []);

  useEffect(() => {
    // the compositor owns it: the CSS keyframes are already attached
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll()")
    ) {
      return;
    }

    let raf = 0;
    let latest = -1;

    const apply = () => {
      raf = 0;
      const sec = sectionRef.current;
      const panel = panelRef.current;
      if (!sec || !panel) return;
      const rect = sec.getBoundingClientRect();
      // measure against the sticky panel, not window.innerHeight: on phones
      // the address bar collapsing changes innerHeight mid-scroll and the
      // crossfade would jump
      const total = rect.height - panel.clientHeight;
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
      className="arrival relative h-[340vh]"
    >
      <div ref={panelRef} className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* Stage 1: the gates */}
        <div
          ref={gatesRef}
          className="arr arr-gates absolute inset-0"
          style={{ willChange: "opacity" }}
        >
          <div
            ref={gatesImgRef}
            className="arr arr-gates-img absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/gates-wreath.jpg"
              alt="The white gates of the GlenLary Estate hung with a wreath"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/70" />
        </div>

        {/* Stage 2: the lane */}
        <div
          ref={laneRef}
          className="arr arr-lane absolute inset-0"
          style={{ opacity: 0, willChange: "opacity" }}
        >
          <div
            ref={laneImgRef}
            className="arr arr-lane-img absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/barn-lane.jpg"
              alt="Four-board fences along the farm lane"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/50" />
        </div>

        {/* Stage 3: the manor */}
        <div
          ref={manorRef}
          className="arr arr-manor absolute inset-0"
          style={{ opacity: 0, willChange: "opacity" }}
        >
          <div
            ref={manorImgRef}
            className="arr arr-manor-img absolute inset-0 will-change-transform"
          >
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

        {/* Stage 1 text. The animated node is the text block itself, never
            the full-screen container: a screen-sized layer per stage is the
            kind of GPU memory a phone does not have. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream">
          <div
            ref={t1Ref}
            className="arr arr-t1 scrim-radial flex flex-col items-center"
            style={{ willChange: "transform, opacity" }}
          >
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
            {/* the eyebrow sits under the wordmark, quiet: the old pine slab
                above it read as stark. Short on phones, full on desktop; the
                wrapper owns display so .tag-hero's inline-flex cannot defeat
                `hidden` */}
            <p className="mt-9 md:mt-11">
              <span className="block md:hidden">
                <span className="tag-hero">Paris, Kentucky · Est. 1840</span>
              </span>
              <span className="hidden md:block">
                <span className="tag-hero">
                  Paris, Kentucky · A working horse farm since 1840
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Stage 2 text: high in the sky on phones, centered on desktop */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center px-6 pt-[22vh] text-center text-cream md:items-center md:pt-0">
          <p
            ref={t2Ref}
            className="arr arr-t2 font-display scrim-radial balance max-w-xl text-3xl font-light italic leading-snug md:text-5xl"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            <span className="on-photo">
              Down the drive, under old trees, between the four-board
              fences&hellip;
            </span>
          </p>
        </div>

        {/* Stage 3 text: above the manor roofline on phones */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start px-6 pt-[18vh] text-center text-cream md:justify-end md:pb-24 md:pt-0">
          <div
            ref={t3Ref}
            className="arr arr-t3 scrim-radial"
            style={{ opacity: 0, pointerEvents: "none", willChange: "transform, opacity" }}
          >
            <p className="font-display on-photo balance text-4xl font-light italic leading-tight md:text-6xl">
              &hellip;until the manor comes into view.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
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
        </div>

        {/* Scroll cue: clear of the phone address bar before it collapses */}
        <div
          ref={cueRef}
          className="arr arr-cue pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 text-cream md:bottom-8"
          style={{ willChange: "opacity" }}
        >
          <span className="label opacity-90">Scroll to make the drive</span>
          <span className="block h-10 w-px animate-pulse bg-cream/70" />
        </div>
      </div>
    </section>
  );
}
