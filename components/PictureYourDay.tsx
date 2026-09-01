"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/Reveal";

type MonthInfo = {
  label: string;
  photo: string;
  alt: string;
  pos?: string;
  sunset: string;
  line: string;
};

const MONTHS: MonthInfo[] = [
  { label: "January", photo: "/images/manor-snow.jpg", alt: "The manor in snow", sunset: "5:45", line: "Snow on the columns and the whole county quiet." },
  { label: "February", photo: "/images/winter-tree.jpg", alt: "A winter tree over white fields", sunset: "6:15", line: "Firelight in the manor and frost on the fences." },
  { label: "March", photo: "/images/pond-spring.jpg", alt: "The pond under a big spring sky", sunset: "7:45", line: "The bluegrass waking up just in time for you." },
  { label: "April", photo: "/images/manor-spring.jpg", alt: "The manor across the spring lawn", sunset: "8:15", line: "Dogwoods on the drive and foals in the paddocks." },
  { label: "May", photo: "/images/barn-lane.jpg", alt: "The lane past the black barn", pos: "center 60%", sunset: "8:45", line: "Peak green, from the gates to the far fence line." },
  { label: "June", photo: "/images/great-oak.jpg", alt: "The great oak in full canopy", sunset: "9:05", line: "The oak in full canopy and the longest light of the year." },
  { label: "July", photo: "/images/pool-cocktails.jpg", alt: "Cocktail hour by the pool at dusk", sunset: "9:00", line: "Long evenings, cocktails by the pool, fireflies after." },
  { label: "August", photo: "/images/pastures-golden.jpg", alt: "Golden light across the pastures", pos: "center 65%", sunset: "8:30", line: "Deep summer, golden by seven, warm past midnight." },
  { label: "September", photo: "/images/barn-summer-lane.jpg", alt: "The white drive curving past the black barn", pos: "center 55%", sunset: "7:45", line: "The light photographers cross state lines for." },
  { label: "October", photo: "/images/gates-autumn.jpg", alt: "The estate gates in autumn color", pos: "center 60%", sunset: "7:00", line: "The maples on the drive catch fire. So will the photos." },
  { label: "November", photo: "/images/pond-autumn-swan.jpg", alt: "The pond in late autumn", sunset: "5:30", line: "Bare branches, honey light, and the farm to yourselves." },
  { label: "December", photo: "/images/cabin-snow.jpg", alt: "The log cabin under fresh snow", pos: "center 55%", sunset: "5:20", line: "Evergreen and candlelight, with snow if you are lucky." },
];

const clean = (v: string) =>
  v.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase();

/** Type your initials, pick your month, and try the date on for size. */
export default function PictureYourDay() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [monthIdx, setMonthIdx] = useState(9);
  const m = MONTHS[monthIdx];
  const yourA = a || "J";
  const yourB = b || "C";
  const nextYear = new Date().getFullYear() + 1;

  return (
    <section className="relative overflow-hidden bg-pine text-cream">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label text-brass-soft">A little daydream</p>
              <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl">
                Try the date on
              </h2>
              <p className="mt-6 max-w-md leading-loose opacity-90">
                Two initials and a month. See how your day would carry itself
                out here, down to when the sun goes.
              </p>

              <div className="mt-10 flex items-end gap-5">
                <label className="block">
                  <span className="label text-cream/70">You</span>
                  <input
                    value={a}
                    onChange={(e) => setA(clean(e.target.value))}
                    maxLength={2}
                    placeholder="J"
                    className="font-display mt-2 w-16 border-b border-cream/40 bg-transparent pb-2 text-center text-5xl font-light text-cream placeholder:text-cream/30 focus:border-brass-soft focus:outline-none"
                    aria-label="Your first initial"
                  />
                </label>
                <span className="font-display pb-2 text-4xl font-light italic text-brass-soft">
                  &
                </span>
                <label className="block">
                  <span className="label text-cream/70">Yours</span>
                  <input
                    value={b}
                    onChange={(e) => setB(clean(e.target.value))}
                    maxLength={2}
                    placeholder="C"
                    className="font-display mt-2 w-16 border-b border-cream/40 bg-transparent pb-2 text-center text-5xl font-light text-cream placeholder:text-cream/30 focus:border-brass-soft focus:outline-none"
                    aria-label="Their first initial"
                  />
                </label>
              </div>

              <div className="mt-8">
                <span className="label text-cream/70">Your month</span>
                <div className="mt-3 flex max-w-md flex-wrap gap-2">
                  {MONTHS.map((mo, i) => (
                    <button
                      key={mo.label}
                      onClick={() => setMonthIdx(i)}
                      className={`label px-3 py-2 transition-colors duration-300 ${
                        i === monthIdx
                          ? "border-l-2 border-l-brass bg-cream text-ink"
                          : "border border-cream/30 text-cream/80 hover:border-cream/70 hover:text-cream"
                      }`}
                    >
                      {mo.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* The rendered daydream */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.15}>
              <div className="arch arch-frame relative mx-auto aspect-[3/4] max-w-md overflow-hidden">
                {MONTHS.map((mo, i) => (
                  <Image
                    key={mo.photo}
                    src={mo.photo}
                    alt={mo.alt}
                    fill
                    className="object-cover transition-opacity duration-700"
                    style={{
                      objectPosition: mo.pos ?? "center",
                      opacity: i === monthIdx ? 1 : 0,
                    }}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/20" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center">
                  <p className="font-brand on-photo text-5xl font-medium tracking-[0.1em]">
                    {yourA}
                    <span className="font-display px-2 text-4xl font-light italic normal-case text-brass-soft">
                      &
                    </span>
                    {yourB}
                  </p>
                  <p className="mt-4">
                    <span className="tag">
                      {m.label} {nextYear} · GlenLary
                    </span>
                  </p>
                  <p className="font-display on-photo mx-auto mt-4 max-w-xs text-lg font-light italic leading-snug">
                    {m.line}
                  </p>
                  <p className="label on-photo mt-3 text-cream">
                    Sunset around {m.sunset} in the evening
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link
                  href={`/tour?when=${encodeURIComponent(`${m.label} ${nextYear}`)}`}
                  className="label btn-fill btn-fill-light inline-block border border-cream/60 px-9 py-4"
                >
                  Make It Real: Book a Tour
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
