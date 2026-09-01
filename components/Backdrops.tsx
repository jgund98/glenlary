"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";

const spaces = [
  {
    numeral: "I",
    title: "The Lary Manor",
    note: "Built 1840",
    body: "Ceremonies before the columns, cocktails in the parlor, and a bridal suite upstairs with nearly two centuries of stories below.",
    image: "/images/manor-processional.jpg",
    alt: "A processional before the Lary Manor",
    pos: "center 45%",
    href: "/estate#manor",
  },
  {
    numeral: "II",
    title: "The Black Barn",
    note: "Rustic, reimagined",
    body: "Kentucky's iconic black barn, swept, strung with greenery chandeliers, and set for a dinner nobody wants to end.",
    image: "/images/bridesmaids-barn.jpg",
    alt: "The bridal party walking from the black barn",
    pos: "center 40%",
    href: "/estate#barn",
  },
  {
    numeral: "III",
    title: "The Great Oak",
    note: "The ceremony lawn",
    body: "One tree, three hundred guests, and the whole bluegrass horizon behind your vows.",
    image: "/images/ceremony-oak-crowd.jpg",
    alt: "A ceremony gathered beneath the great oak",
    pos: "center 50%",
    href: "/estate#grounds",
  },
  {
    numeral: "IV",
    title: "The Tented Lawn",
    note: "Sailcloth & chandeliers",
    body: "Crystal under canvas beside the pool, from the first toast to the last song under the stars.",
    image: "/images/reception-toast-bride.jpg",
    alt: "The bride taking the microphone under the tent",
    pos: "center 45%",
    href: "/estate#grounds",
  },
];

/**
 * The venue index: hover a name and the estate answers with the room.
 * Falls back to clean stacked cards below lg.
 */
export default function Backdrops() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="label text-brass">Four settings, one estate</p>
        </Reveal>
        <MaskReveal
          className="font-display mt-4 max-w-xl text-4xl font-light leading-tight md:text-6xl"
          delay={0.08}
        >
          Choose your backdrop
        </MaskReveal>

        {/* Desktop: index + answering image */}
        <div className="mt-16 hidden gap-12 lg:grid lg:grid-cols-12">
          <div className="flex flex-col justify-center lg:col-span-5">
            {spaces.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group border-b border-ink/12 py-7 transition-colors duration-300 first:border-t ${
                  i === active ? "border-b-brass/60" : ""
                }`}
              >
                <div className="flex items-baseline gap-5">
                  <span
                    className={`font-display w-8 text-xl italic transition-colors duration-300 ${
                      i === active ? "text-brass" : "text-ink-soft"
                    }`}
                  >
                    {s.numeral}.
                  </span>
                  <span
                    className={`font-display whitespace-nowrap text-3xl font-light transition-all duration-300 xl:text-4xl ${
                      i === active
                        ? "translate-x-1 text-pine"
                        : "text-ink-soft group-hover:text-ink"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                <p
                  className="overflow-hidden pl-13 text-sm leading-relaxed text-ink-soft transition-all duration-500"
                  style={{
                    maxHeight: i === active ? "5rem" : "0",
                    opacity: i === active ? 1 : 0,
                    paddingLeft: "3.25rem",
                    marginTop: i === active ? "0.6rem" : "0",
                  }}
                >
                  {s.body}
                </p>
              </Link>
            ))}
            <Link
              href="/estate"
              className="label link-sweep mt-10 self-start pb-1 text-ink"
            >
              Explore the whole estate
            </Link>
          </div>

          <div className="elev-3 relative overflow-hidden lg:col-span-7" style={{ minHeight: 560 }}>
            {spaces.map((s, i) => (
              <div
                key={s.image}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
                aria-hidden={i !== active}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: s.pos,
                    transform: i === active ? "scale(1)" : "scale(1.04)",
                    transition: "transform 1.6s ease-out",
                  }}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent p-6">
                  <span className="tag">{s.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: uniform stacked cards */}
        <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-8 lg:hidden">
          {spaces.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08}>
              <Link href={s.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: s.pos }}
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex items-baseline gap-3 pt-5">
                  <span className="font-display text-lg italic text-brass">
                    {s.numeral}.
                  </span>
                  <h3 className="font-display text-3xl font-light">{s.title}</h3>
                </div>
                <p className="label mt-1.5 text-brass">{s.note}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
