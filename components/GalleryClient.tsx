"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gallery, galleryCats } from "@/lib/site";

export default function GalleryClient() {
  const [cat, setCat] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const items = useMemo(
    () => (cat === "all" ? gallery : gallery.filter((g) => g.cat === cat)),
    [cat]
  );

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

  return (
    <div>
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
                  : "border border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink"
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

      {/* Masonry via CSS columns; remounts per filter with a CSS stagger */}
      <div key={cat} className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6">
        {items.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setLightbox(i)}
            className="gallery-item group mb-4 block w-full break-inside-avoid overflow-hidden text-left md:mb-6"
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
