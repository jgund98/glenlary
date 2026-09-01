"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const seasons = [
  {
    key: "spring",
    label: "Spring",
    heading: "The bluegrass wakes up first",
    body: "Foals in the paddocks, dogwoods along the drive, and that impossible Kentucky green rolling all the way to the fence line. Spring at GlenLary photographs like a memory you have not made yet.",
    main: { src: "/images/manor-spring.jpg", alt: "The manor across the bright spring lawn" },
    side: { src: "/images/pond-spring.jpg", alt: "The pond under a towering spring sky" },
  },
  {
    key: "summer",
    label: "Summer",
    heading: "Long evenings, longer toasts",
    body: "Ceremonies under the great oak's full canopy, cocktail hour by the pool, fireflies over the pastures as dinner runs late under the tent. Summer is the estate at full volume.",
    main: { src: "/images/manor-front.jpg", alt: "The Lary Manor in high summer" },
    side: { src: "/images/great-oak.jpg", alt: "The great oak over the ceremony lawn" },
  },
  {
    key: "autumn",
    label: "Autumn",
    heading: "The farm turns to gold",
    body: "The maples along the drive catch fire, the light turns to honey by four in the afternoon, and even the swan on the pond seems to pose. Autumn weddings at GlenLary are the ones photographers brag about.",
    main: { src: "/images/drive-autumn-couple.jpg", alt: "A couple on the long drive in autumn" },
    side: { src: "/images/pond-autumn-swan.jpg", alt: "The pond in autumn with its resident swan" },
  },
  {
    key: "winter",
    label: "Winter",
    heading: "Quiet, white, and yours alone",
    body: "Snow on the manor's columns, smoke rising from the cabin chimney, and the whole county hushed. Winter weddings here feel like a secret only your guests were told.",
    main: { src: "/images/manor-snow.jpg", alt: "The manor after a snowfall" },
    side: { src: "/images/couple-snow.jpg", alt: "A couple crossing the snowy fields" },
  },
];

export default function Seasons() {
  const [active, setActive] = useState(0);
  const s = seasons[active];

  // the whole room changes with the season
  const tints: Record<string, string> = {
    spring: "#ecf2e6",
    summer: "#f8f4e6",
    autumn: "#f6ecdd",
    winter: "#eceff1",
  };

  return (
    <section
      style={{
        backgroundColor: tints[s.key],
        transition: "background-color 0.9s ease",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="label text-brass">Four estates for the price of one</p>
          <h2 className="font-display mt-4 max-w-2xl text-4xl font-light leading-tight md:text-6xl">
            Pick your season
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2 md:gap-3">
          {seasons.map((season, i) => (
            <button
              key={season.key}
              onClick={() => setActive(i)}
              className={`label px-5 py-3 transition-colors duration-300 md:px-7 ${
                i === active
                  ? "border-l-2 border-l-brass-soft bg-pine text-cream"
                  : "border border-ink/25 text-ink/85 hover:border-ink/60 hover:text-ink"
              }`}
            >
              {season.label}
            </button>
          ))}
        </div>

        <div className="relative mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-12"
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[540px]">
                <Image
                  src={s.main.src}
                  alt={s.main.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              </div>
              <div className="flex flex-col justify-between gap-8 lg:col-span-5">
                <div>
                  <h3 className="font-display text-3xl font-light leading-snug md:text-5xl">
                    {s.heading}
                  </h3>
                  <p className="mt-5 max-w-md leading-loose text-ink/85">
                    {s.body}
                  </p>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-[16/8] lg:aspect-[16/10]">
                  <Image
                    src={s.side.src}
                    alt={s.side.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 38vw, 100vw"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
