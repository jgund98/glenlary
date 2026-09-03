"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gallery, galleryCats, type GalleryItem } from "@/lib/site";
import EstateMap from "./EstateMap";

type PhotoCell = { g: GalleryItem; i: number };
type Cell = PhotoCell | { filler: "tour" | "notes"; ratio: number };

function FillerTile({ kind, ratio }: { kind: "tour" | "notes"; ratio: number }) {
  const tour = kind === "tour";
  return (
    <Link
      href={tour ? "/tour" : "/love-notes"}
      style={{ aspectRatio: `1 / ${ratio}` }}
      className={`gallery-item group flex w-full flex-col items-center justify-center px-5 text-center ${
        tour ? "bg-pine text-cream" : "elev-1 bg-parchment text-pine"
      }`}
    >
      <span className={`label ${tour ? "text-brass-soft" : "text-brass"}`}>
        {tour ? "Your chapter next" : "In their words"}
      </span>
      <span className="font-display balance mt-2 text-xl font-light italic leading-snug md:text-2xl">
        {tour ? "Picture yourselves here" : "Every couple says the same thing"}
      </span>
      <span
        className={`label link-sweep mt-3 pb-0.5 text-[10px] ${tour ? "text-cream/80" : "text-ink-soft"}`}
      >
        {tour ? "Book a tour" : "Read the love notes"}
      </span>
    </Link>
  );
}

export default function GalleryClient() {
  const [cat, setCat] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const items = useMemo(
    () => (cat === "all" ? gallery : gallery.filter((g) => g.cat === cat)),
    [cat]
  );

  // Two columns on phones, three from md up. Decided on the client so the
  // photos can be dealt shortest-column-first and every column ends together.
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setCols(mq.matches ? 3 : 2);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const columns = useMemo(() => {
    const unit = (g: GalleryItem) => g.h / g.w + 0.05; // height per unit width, plus gap
    const heights = new Array<number>(cols).fill(0);
    const buckets: Cell[][] = Array.from({ length: cols }, () => []);
    const photo = (c: Cell): c is PhotoCell => "g" in c;
    items.forEach((g, i) => {
      let k = 0;
      for (let c = 1; c < cols; c++) if (heights[c] < heights[k]) k = c;
      buckets[k].push({ g, i });
      heights[k] += unit(g);
    });
    // Level the columns: try every single move or swap between two columns
    // and keep the one that narrows the spread most, until nothing helps.
    const spreadOf = (h: number[]) => Math.max(...h) - Math.min(...h);
    for (let iter = 0; iter < 60; iter++) {
      let best: { s: number; a: number; c: number; xi: number; yi?: number } | null = null;
      let bestS = spreadOf(heights);
      for (let a = 0; a < cols; a++) {
        for (let c = 0; c < cols; c++) {
          if (a === c) continue;
          buckets[a].forEach((x, xi) => {
            if (!photo(x)) return;
            const u = unit(x.g);
            const h1 = [...heights];
            h1[a] -= u;
            h1[c] += u;
            const s1 = spreadOf(h1);
            if (s1 < bestS - 1e-6) {
              bestS = s1;
              best = { s: s1, a, c, xi };
            }
            buckets[c].forEach((y, yi) => {
              if (!photo(y)) return;
              const v = unit(y.g);
              const h2 = [...heights];
              h2[a] += v - u;
              h2[c] += u - v;
              const s2 = spreadOf(h2);
              if (s2 < bestS - 1e-6) {
                bestS = s2;
                best = { s: s2, a, c, xi, yi };
              }
            });
          });
        }
      }
      if (!best) break;
      const { a, c, xi, yi } = best as { a: number; c: number; xi: number; yi?: number };
      const x = buckets[a][xi] as PhotoCell;
      if (yi === undefined) {
        buckets[a].splice(xi, 1);
        buckets[c].push(x);
        heights[a] -= unit(x.g);
        heights[c] += unit(x.g);
      } else {
        const y = buckets[c][yi] as PhotoCell;
        buckets[a][xi] = y;
        buckets[c][yi] = x;
        heights[a] += unit(y.g) - unit(x.g);
        heights[c] += unit(x.g) - unit(y.g);
      }
    }
    // Most frames are 3:2 or 2:3, so a column can still end one landscape
    // short. Instead of a hole, that column closes on an invitation tile.
    const top = Math.max(...heights);
    let tiles = 0;
    heights
      .map((h, c) => ({ c, deficit: top - h }))
      .sort((p, q) => q.deficit - p.deficit)
      .forEach(({ c, deficit }) => {
        if (deficit < 0.3 || tiles >= 2) return;
        buckets[c].push({ filler: tiles === 0 ? "tour" : "notes", ratio: deficit - 0.05 });
        tiles += 1;
      });
    return buckets;
  }, [items, cols]);

  const close = useCallback(() => {
    setLightbox(null);
    setPlaying(false);
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? null : (cur + dir + items.length) % items.length
      );
    },
    [items.length]
  );

  // cinema mode: lean back and watch the venue
  useEffect(() => {
    if (!playing || lightbox === null) return;
    const t = setInterval(() => step(1), 3400);
    return () => clearInterval(t);
  }, [playing, lightbox, step]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [lightbox, close, step]);

  // From the map card: filter the grid and glide down to it
  const gridRef = useRef<HTMLDivElement>(null);
  const explore = useCallback((c: string) => {
    setCat(c);
    requestAnimationFrame(() => {
      const el = gridRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      const w = window as unknown as {
        __lenis?: { scrollTo: (t: number, o?: { duration?: number }) => void };
      };
      if (w.__lenis) w.__lenis.scrollTo(top, { duration: 1.4 });
      else window.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  return (
    <div>
      <EstateMap onExplore={explore} />

      <div ref={gridRef} aria-hidden className="h-px" />

      {/* Filters */}
      <div className="sticky top-16 z-30 -mx-5 border-b border-ink/10 bg-cream/95 px-5 py-4 backdrop-blur-sm md:top-20 md:mx-0 md:px-0">
        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
          {galleryCats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`label whitespace-nowrap px-4 py-2.5 transition-colors duration-300 md:px-5 ${
                cat === c.key
                  ? "border-l-2 border-l-brass-soft bg-pine text-cream"
                  : "border border-ink/15 text-ink-soft hover:border-ink/50 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
          <span
            aria-hidden
            className="mx-1 hidden w-px self-stretch bg-ink/15 md:block"
          />
          <button
            onClick={() => {
              setLightbox(0);
              setPlaying(true);
            }}
            className="label hidden whitespace-nowrap border border-brass px-5 py-2.5 text-brass transition-colors duration-300 hover:bg-brass hover:text-cream md:block"
          >
            ▸ Slideshow
          </button>
        </div>
      </div>

      {/* Masonry: photos dealt into height-balanced columns so no column
          ends early and leaves a hole; remounts per filter with a CSS stagger */}
      <div key={`${cat}-${cols}`} className="mt-10 flex gap-4 md:gap-6">
        {columns.map((col, ci) => (
          <div key={ci} className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
            {col.map((cell) => {
              if (!("g" in cell)) {
                return <FillerTile key={cell.filler} kind={cell.filler} ratio={cell.ratio} />;
              }
              const { g, i } = cell;
              return (
              <button
                key={g.src}
                onClick={() => setLightbox(i)}
                className="gallery-item group block w-full overflow-hidden text-left"
                style={{ animationDelay: `${Math.min(i, 14) * 0.045}s` }}
                aria-label={`Open photo: ${g.alt}`}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: `${g.w} / ${g.h}` }}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="font-display absolute inset-x-0 bottom-0 translate-y-2 p-4 text-base font-light italic leading-snug text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {g.alt}
                  </p>
                </div>
              </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-cream backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-8">
              <span className="label opacity-70">
                {lightbox + 1} / {items.length}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying((p) => !p);
                  }}
                  className={`label border px-4 py-2 transition-colors ${
                    playing
                      ? "border-brass-soft bg-brass-soft/20 text-brass-soft"
                      : "border-cream/40 hover:bg-cream hover:text-ink"
                  }`}
                >
                  {playing ? "Pause" : "▸ Play"}
                </button>
                <button
                  onClick={close}
                  className="label border border-cream/40 px-4 py-2 transition-colors hover:bg-cream hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
            <div
              className="relative flex-1 px-4 pb-4 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={items[lightbox].src}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={items[lightbox].src}
                    alt={items[lightbox].alt}
                    fill
                    className={`object-contain ${playing ? "kenburns" : ""}`}
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <button
                aria-label="Previous photo"
                onClick={() => step(-1)}
                className="absolute left-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 transition-colors hover:bg-cream hover:text-ink md:flex"
              >
                ←
              </button>
              <button
                aria-label="Next photo"
                onClick={() => step(1)}
                className="absolute right-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 transition-colors hover:bg-cream hover:text-ink md:flex"
              >
                →
              </button>
            </div>
            <div
              className="flex items-center justify-between px-5 pb-6 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display max-w-md text-lg font-light italic opacity-90">
                {items[lightbox].alt}
              </p>
              <div className="flex gap-3 md:hidden">
                <button
                  aria-label="Previous photo"
                  onClick={() => step(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30"
                >
                  ←
                </button>
                <button
                  aria-label="Next photo"
                  onClick={() => step(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
