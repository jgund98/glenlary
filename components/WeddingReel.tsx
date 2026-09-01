"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/images/ceremony-bluegrass-wide.jpg",
    alt: "A ceremony on the lawn with the bluegrass rolling out behind it",
    caption: "Vows against eighty acres of bluegrass",
    pos: "center 55%",
  },
  {
    src: "/images/tent-pool-night.jpg",
    alt: "The sailcloth tent glowing over the pool after dark",
    caption: "The tent, once the sun goes down",
    pos: "center 50%",
  },
  {
    src: "/images/barn-aisle.jpg",
    alt: "The black barn with an aisle runner leading to its doors",
    caption: "An aisle to the black barn doors",
    pos: "center 55%",
  },
  {
    src: "/images/tent-lights-wide.jpg",
    alt: "Inside the sailcloth tent, tables set beneath string lights",
    caption: "Dinner under sailcloth and string light",
    pos: "center 55%",
  },
  {
    src: "/images/pool-cocktails-manor.jpg",
    alt: "Cocktail hour around the pool with the manor behind",
    caption: "Cocktail hour at the pool",
    pos: "center 45%",
  },
  {
    src: "/images/ceremony-sunset-manor.jpg",
    alt: "Ceremony chairs before the manor at golden hour",
    caption: "Golden hour on the manor lawn",
    pos: "center 50%",
  },
];

const HOLD = 3300;

/** A modern take on the old site's rotating hero: real weddings, full bleed. */
export default function WeddingReel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    timer.current = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      HOLD
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  return (
    <section
      aria-label="Real weddings at GlenLary"
      className="relative h-[86vh] overflow-hidden bg-ink text-cream md:h-screen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-opacity duration-[950ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            className="object-cover"
            style={{
              objectPosition: s.pos,
              transform: i === active ? "scale(1)" : "scale(1.05)",
              transition: "transform 4.2s ease-out",
            }}
            sizes="100vw"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" />
      <div className="grain absolute inset-0" />

      <div className="absolute inset-x-0 top-0 flex justify-center pt-24 md:pt-28">
        <span className="tag">Real weddings at GlenLary</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-8 px-6 pb-12 text-center md:pb-16">
        <div className="relative h-16 w-full md:h-14">
          {slides.map((s, i) => (
            <p
              key={s.src}
              className="font-display on-photo absolute inset-x-0 text-3xl font-light italic transition-all duration-700 md:text-5xl"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "none" : "translateY(12px)",
              }}
              aria-hidden={i !== active}
            >
              {s.caption}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-5">
          {slides.map((s, i) => (
            <button
              key={s.src}
              aria-label={`Show: ${s.caption}`}
              onClick={() => setActive(i)}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-10 bg-cream"
                    : "w-4 bg-cream/40 group-hover:bg-cream/70"
                }`}
              />
            </button>
          ))}
        </div>
        <Link href="/gallery" className="label on-photo link-sweep pb-1">
          See the whole gallery
        </Link>
      </div>
    </section>
  );
}
