"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * The Residents: a paddock strip rather than a photo-beside-text block.
 * Three frames at staggered heights drift as you pass; the display line
 * sits in clear ground beneath them, never across a face.
 */

const frames = [
  {
    src: "/images/horse-portrait.jpg",
    alt: "One of GlenLary's horses at the four-board fence",
    caption: "at the fence, during portraits",
    pos: "center",
    tall: true,
    drift: -24,
    lift: "lg:-translate-y-8",
  },
  {
    src: "/images/couple-horse.jpg",
    alt: "A bride and groom greeting a horse over the fence",
    caption: "across the paddock, at cocktail hour",
    pos: "center 40%",
    tall: false,
    drift: 16,
    lift: "lg:translate-y-10",
  },
  {
    src: "/images/couple-horse-bw.jpg",
    alt: "Newlyweds at the fence line with a horse, in black and white",
    caption: "in the pasture, as the sun goes",
    pos: "center 45%",
    tall: false,
    drift: -12,
    lift: "lg:-translate-y-2",
  },
];

export default function Residents() {
  const ref = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh + r.height / 2);
      frames.forEach((f, i) => {
        const node = itemRefs.current[i];
        if (node) node.style.transform = `translateX(${p * f.drift}px)`;
      });
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
    <section ref={ref} className="relative overflow-hidden bg-pine-deep text-cream">
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        {/* ledger header */}
        <div className="flex items-baseline justify-between gap-6 border-b border-cream/20 pb-4">
          <p className="label text-brass-soft">The residents</p>
          <p className="label hidden text-cream/70 sm:block">
            A working horse farm since 1840
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-end gap-4 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {frames.map((f, i) => (
            <div
              key={f.src}
              className={`${i === 2 ? "col-span-2 lg:col-span-1" : ""} ${f.lift}`}
            >
              <div
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="will-change-transform"
              >
                <div
                  className={`elev-3 relative overflow-hidden ${
                    f.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: f.pos }}
                    sizes="(min-width: 1024px) 32vw, 50vw"
                  />
                </div>
                <p className="font-hand mt-3 text-xl text-brass-soft">
                  {f.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* the line lives in clear ground, never across a face */}
        <h2 className="font-display balance mt-14 max-w-4xl text-4xl font-light italic leading-[1.1] md:mt-20 md:text-6xl lg:text-7xl">
          Your other guests have four legs
        </h2>

        <div className="mt-8 grid gap-8 border-t border-cream/20 pt-8 md:mt-10 md:grid-cols-12 md:pt-10">
          <p className="leading-loose text-cream/90 md:col-span-7 lg:col-span-6">
            GlenLary is no set piece. It is a working horse farm, and the
            residents like to make an appearance. Couples plan around a
            thousand details; the horses are the one nobody forgets.
          </p>
          <div className="md:col-span-5 md:self-end md:text-right lg:col-span-6">
            <Link
              href="/estate"
              className="label link-sweep relative text-brass-soft"
            >
              Meet the estate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
