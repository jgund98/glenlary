"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";

type Chapter = {
  time: string;
  title: string;
  body: string;
  image: { src: string; alt: string; pos?: string; tall?: boolean };
  second?: { src: string; alt: string };
};

const chapters: Chapter[] = [
  {
    time: "9:04 am",
    title: "The manor wakes up with you",
    body: "Robes, champagne, and your favorite people sprawled across the bridal suite while the gown hangs in the wardrobe and the farm goes about its morning outside the windows. Down at the cabin, the groomsmen have the hunting lodge to themselves.",
    image: { src: "/images/bridesmaids-robes.jpg", alt: "The bridal party in robes on the manor suite bed" },
    second: { src: "/images/dress-wardrobe.jpg", alt: "The gown hanging in the bridal suite" },
  },
  {
    time: "2:30 pm",
    title: "A first look on the lane",
    body: "A quiet stretch of four-board fence, one deep breath, and a turn. The horses usually wander over to watch. Nobody minds.",
    image: { src: "/images/couple-fence-lane.jpg", alt: "A first look on the fence-lined lane" },
    second: { src: "/images/couple-horse.jpg", alt: "A pause with one of the horses" },
  },
  {
    time: "4:30 pm",
    title: "Vows beneath the great oak",
    body: "Three hundred chairs on the lawn, the bluegrass rolling out behind you, and a tree that has stood over this ground longer than the manor itself. Or say them on the front steps, framed by columns. Either way, there will not be a dry eye or a bad seat.",
    image: { src: "/images/ceremony-oak-chairs.jpg", alt: "White chairs circled beneath the great oak", pos: "center 65%" },
    second: { src: "/images/ceremony-vows.jpg", alt: "Vows under the oak" },
  },
  {
    time: "6:00 pm",
    title: "Cocktails as the light turns gold",
    body: "Bourbon by the pool, drinks on the porch, the photographer stealing you away for twenty minutes while golden hour does what golden hour does at GlenLary.",
    image: { src: "/images/pool-cocktails-manor.jpg", alt: "Cocktail hour beside the pool at dusk" },
    second: { src: "/images/couple-golden-field.jpg", alt: "Golden-hour portraits over the pastures" },
  },
  {
    time: "8:15 pm",
    title: "Dinner under sailcloth and crystal",
    body: "Chandeliers under canvas, a king's table running the length of the tent, toasts that run long because nobody wants to sit down. Or move the whole affair into the black barn and let the greenery chandeliers do the talking.",
    image: { src: "/images/tent-chandeliers.jpg", alt: "Crystal chandeliers under the sailcloth tent" },
    second: { src: "/images/barn-long-table.jpg", alt: "A long table down the barn gallery" },
  },
  {
    time: "10:30 pm",
    title: "The floor fills and stays full",
    body: "The band kicks, the string lights blur, and the farm's famous quiet gives way for a few loud, perfect hours. Out here, the music plays as late as you can.",
    image: { src: "/images/dancefloor-lights.jpg", alt: "The dance floor under string lights" },
    second: { src: "/images/band-playing.jpg", alt: "The band mid-set" },
  },
  {
    time: "11:47 pm",
    title: "The tent still glowing",
    body: "Canvas lit from within on a lawn with no city glow to dim the sky, a vintage car idling on the drive, and a night nobody out here will ever quite get over.",
    image: { src: "/images/tent-night-glow.jpg", alt: "The sailcloth tent glowing on the lawn after dark" },
    second: { src: "/images/bar-trailer-night.jpg", alt: "The bar glowing after dark" },
  },
];

type RGB = [number, number, number];

function lerpColor(stops: number[], colors: RGB[], p: number): RGB {
  if (p <= stops[0]) return colors[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) {
      const t = (p - stops[i - 1]) / (stops[i] - stops[i - 1]);
      const a = colors[i - 1];
      const b = colors[i];
      return [
        Math.round(a[0] + t * (b[0] - a[0])),
        Math.round(a[1] + t * (b[1] - a[1])),
        Math.round(a[2] + t * (b[2] - a[2])),
      ];
    }
  }
  return colors[colors.length - 1];
}

const BG_STOPS = [0, 0.3, 0.52, 0.72, 0.9];
const BG_COLORS: RGB[] = [
  [250, 250, 247],
  [242, 240, 234],
  [226, 209, 182],
  [69, 74, 86],
  [20, 24, 31],
];
const FG_STOPS = [0.58, 0.7];
const FG_COLORS: RGB[] = [
  [29, 35, 28],
  [250, 250, 247],
];

/**
 * One Perfect Day: as you scroll from morning to midnight the section's
 * backdrop sinks from daylight cream to deep night. Colors are written in
 * a rAF scroll handler (framer's scroll-linked values misfire in v13).
 */
export default function DayTimeline() {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when section top hits 70% viewport, 1 when bottom hits 90%
      const start = vh * 0.7;
      const end = vh * 0.9;
      const total = rect.height - start + end - vh;
      const p = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, total)));

      const bg = lerpColor(BG_STOPS, BG_COLORS, p);
      const fg = lerpColor(FG_STOPS, FG_COLORS, p);
      el.style.backgroundColor = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
      el.style.color = `rgb(${fg[0]},${fg[1]},${fg[2]})`;
      if (railRef.current) {
        railRef.current.style.backgroundColor = `rgba(${fg[0]},${fg[1]},${fg[2]},0.25)`;
      }
      if (starsRef.current) {
        const s = Math.min(1, Math.max(0, (p - 0.74) / 0.16));
        starsRef.current.style.opacity = String(s);
      }
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
      ref={ref}
      style={{ backgroundColor: "#fafaf7", color: "#1d231c" }}
      className="relative overflow-hidden"
    >
      {/* starfield fading in as the day goes dark */}
      <div
        ref={starsRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          opacity: 0,
          backgroundRepeat: "repeat",
          backgroundSize: "560px 430px",
          backgroundImage:
            "radial-gradient(1px 1px at 12% 18%, rgba(250,250,247,0.9) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 28% 64%, rgba(250,250,247,0.7) 50%, transparent 51%), radial-gradient(1px 1px at 41% 32%, rgba(250,250,247,0.8) 50%, transparent 51%), radial-gradient(2px 2px at 57% 11%, rgba(250,250,247,0.6) 50%, transparent 51%), radial-gradient(1px 1px at 66% 47%, rgba(250,250,247,0.85) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 78% 25%, rgba(250,250,247,0.7) 50%, transparent 51%), radial-gradient(1px 1px at 87% 58%, rgba(250,250,247,0.9) 50%, transparent 51%), radial-gradient(1px 1px at 8% 76%, rgba(250,250,247,0.6) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 49% 82%, rgba(250,250,247,0.65) 50%, transparent 51%), radial-gradient(1px 1px at 93% 85%, rgba(250,250,247,0.75) 50%, transparent 51%), radial-gradient(1px 1px at 21% 41%, rgba(250,250,247,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 71% 71%, rgba(250,250,247,0.55) 50%, transparent 51%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="label text-brass">From first light to last lantern</p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl font-light leading-tight md:text-6xl">
            One perfect day
          </h2>
          <p className="mt-6 max-w-xl leading-loose opacity-90">
            Every wedding here writes its own script, but the sun keeps a
            schedule. Scroll through a day at GlenLary and watch the estate
            change its mind about the lighting.
          </p>
        </Reveal>

        <div className="relative mt-20 md:mt-28">
          {/* center rail */}
          <div
            ref={railRef}
            style={{ backgroundColor: "rgba(29,35,28,0.25)" }}
            className="absolute left-[7px] top-0 hidden h-full w-px md:left-1/2 md:block"
          />

          <div className="space-y-24 md:space-y-36">
            {chapters.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <div
                  key={c.time}
                  className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16"
                >
                  {/* dot on the rail */}
                  <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-brass bg-transparent md:block" />

                  <Reveal
                    className={flip ? "md:order-2 md:pl-16" : "md:pr-16"}
                  >
                    <div className="relative">
                      <div
                        className={`relative overflow-hidden ${
                          c.image.tall
                            ? "mx-auto aspect-[3/4] max-w-[420px] md:mx-0"
                            : "aspect-[4/3]"
                        }`}
                      >
                        <Image
                          src={c.image.src}
                          alt={c.image.alt}
                          fill
                          className="object-cover"
                          style={c.image.pos ? { objectPosition: c.image.pos } : undefined}
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                      {c.second && (
                        <div
                          className={`absolute -bottom-8 hidden w-1/3 shadow-[0_18px_40px_rgba(0,0,0,0.28)] md:block ${
                            flip ? "-left-5" : "-right-5"
                          }`}
                        >
                          <div className="relative aspect-[3/4]">
                            <Image
                              src={c.second.src}
                              alt={c.second.alt}
                              fill
                              className="object-cover"
                              sizes="18vw"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>

                  <Reveal
                    delay={0.12}
                    className={flip ? "md:order-1 md:pr-16 md:text-right" : "md:pl-16"}
                  >
                    <p className="font-display text-6xl font-light italic text-brass md:text-7xl">
                      {c.time}
                    </p>
                    <h3 className="font-display mt-4 text-3xl font-light leading-snug md:text-4xl">
                      {c.title}
                    </h3>
                    <p
                      className={`mt-4 max-w-md leading-loose opacity-75 ${
                        flip ? "md:ml-auto" : ""
                      }`}
                    >
                      {c.body}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>

        <Reveal className="mt-28 text-center md:mt-36">
          <p className="font-display text-3xl font-light italic md:text-5xl">
            And then the stars, which are better out here.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
