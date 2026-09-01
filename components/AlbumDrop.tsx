"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * From the Album: as you scroll, real prints toss themselves onto the table
 * one by one, developing from washed-out to full color. The last frame is
 * still blank. Scroll-driven by a manual rAF handler (house rule: no
 * framer-motion scroll values).
 */

type Print = {
  src: string;
  alt: string;
  caption: string;
  pos?: string;
  // resting pose (percent offsets from center of the table, degrees)
  x: number;
  y: number;
  r: number;
  z: number;
};

const prints: Print[] = [
  { src: "/images/porch-kiss.jpg", alt: "A kiss beside the manor porch", caption: "the kiss", x: -32, y: -22, r: -7, z: 1 },
  { src: "/images/ring-pillow.jpg", alt: "A monogrammed ring pillow", caption: "the rings", x: -21, y: -29, r: 5, z: 2, pos: "center 45%" },
  { src: "/images/bridesmaids-navy.jpg", alt: "The bridal party in navy at the shutters", caption: "the whole crew", x: 29, y: -25, r: 5, z: 2, pos: "center 30%" },
  { src: "/images/groom-manor-door.jpg", alt: "The groom waiting at the manor door", caption: "the nerves", x: 19, y: -31, r: -4, z: 3, pos: "center 30%" },
  { src: "/images/couple-two-horses.jpg", alt: "Bride and groom with two of the horses", caption: "the witnesses", x: -31, y: 16, r: 6, z: 3, pos: "24% 40%" },
  { src: "/images/sky-lanterns.jpg", alt: "Sky lanterns over the send-off", caption: "almost midnight", x: -20, y: 25, r: -5, z: 4, pos: "center 35%" },
  { src: "/images/pool-entrance.jpg", alt: "The grand entrance by the pool", caption: "the grand entrance", x: 31, y: 13, r: -6, z: 4, pos: "center 35%" },
  { src: "/images/cake-magnolia.jpg", alt: "A magnolia-trimmed cake", caption: "the cake", x: 23, y: 25, r: 4, z: 5, pos: "center 55%" },
  { src: "/images/first-dance.jpg", alt: "The first dance under the tent", caption: "the first dance", x: -3, y: -16, r: 2, z: 6, pos: "center 30%" },
  { src: "", alt: "", caption: "your day, here", x: 0, y: 12, r: -2, z: 10 },
];

function ramp(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}
// spring-ish ease with a little overshoot for the "toss"
function toss(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -9 * t) * Math.cos(t * 7);
}

export default function AlbumDrop() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      if (headRef.current) {
        headRef.current.style.opacity = String(1 - ramp(p, 0.82, 0.96) * 0.35);
      }

      const n = prints.length;
      prints.forEach((pr, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const start = 0.06 + (i * 0.82) / n;
        const end = start + 0.82 / n;
        const t = reduced ? 1 : toss(ramp(p, start, end));
        const dev = reduced ? 1 : ramp(p, start + 0.02, end + 0.05);

        // fly in from below-right with extra spin, settle into the pose
        const fx = pr.x + (1 - t) * 55;
        const fy = pr.y + (1 - t) * 120;
        const fr = pr.r + (1 - t) * 24;
        el.style.transform = `translate(-50%, -50%) translate(${fx}cqw, ${fy}cqh) rotate(${fr}deg)`;
        el.style.opacity = t > 0.02 ? "1" : "0";

        const img = el.querySelector("img");
        if (img) {
          // the print develops: washed and pale, then true color
          (img as HTMLElement).style.filter = `sepia(${(1 - dev) * 0.5}) brightness(${1.6 - dev * 0.6}) contrast(${0.6 + dev * 0.4}) saturate(${0.3 + dev * 0.7})`;
        }
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
    <section
      ref={sectionRef}
      aria-label="From the album"
      className="relative h-[330vh] bg-parchment"
    >
      <div
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
        style={{ containerType: "size" }}
      >
        {/* linen table */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, #f4f1e8 0%, #eae6d9 55%, #ddd8c8 100%)",
          }}
        />
        <div className="grain absolute inset-0" />

        <div ref={headRef} className="relative pt-24 text-center md:pt-28">
          <p className="label text-brass">From the album</p>
          <h2 className="font-display mt-3 text-4xl font-light md:text-5xl">
            Proof it happens here
          </h2>
          <p className="font-hand mt-2 text-2xl text-ink/70">
            keep scrolling, the prints are still developing
          </p>
        </div>

        {/* the table center */}
        <div className="relative flex-1">
          {prints.map((pr, i) => (
            <div
              key={pr.caption}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`polaroid absolute left-1/2 top-1/2 opacity-0 ${
                pr.src
                  ? "w-[46cqw] max-w-[240px] sm:max-w-[270px] md:w-[24cqw] md:max-w-[300px]"
                  : "w-[54cqw] max-w-[270px] sm:max-w-[300px] md:w-[27cqw] md:max-w-[340px]"
              }`}
              style={{ zIndex: pr.z, willChange: "transform" }}
            >
              {pr.src ? (
                <div className="relative aspect-square overflow-hidden bg-linen">
                  <Image
                    src={pr.src}
                    alt={pr.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: pr.pos ?? "center" }}
                    sizes="300px"
                  />
                </div>
              ) : (
                <Link
                  href="/tour"
                  className="relative flex aspect-square items-center justify-center bg-[#f6f4ee] transition-colors hover:bg-[#f1eee4]"
                >
                  <span className="font-display px-6 text-center text-xl font-light italic text-ink/60">
                    add yours
                    <span className="mt-2 block text-sm not-italic tracking-wide text-brass">
                      Book a private tour →
                    </span>
                  </span>
                </Link>
              )}
              <p className="font-hand absolute inset-x-0 bottom-1.5 text-center text-[1.35rem] leading-none text-ink/80">
                {pr.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
