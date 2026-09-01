"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { vendors } from "@/lib/site";

const categoryImage: Record<string, { src: string; alt: string }> = {
  "Event Coordination": { src: "/images/tent-long-table.jpg", alt: "A styled king's table under the tent" },
  Photography: { src: "/images/couple-veil-field.jpg", alt: "A veil catching the breeze at golden hour" },
  Catering: { src: "/images/drinks.jpg", alt: "Front-porch drinks in mason jars" },
  "Floral Design": { src: "/images/bouquet.jpg", alt: "A pastel bouquet in full sun" },
  Stationery: { src: "/images/stationery-horses.jpg", alt: "A horse-print stationery suite" },
  "Hair & Makeup": { src: "/images/morning-prep.jpg", alt: "Finishing touches in the bridal suite" },
};

/** Hover a category and its work follows your cursor. Fine pointers only. */
export default function VendorsList() {
  const [hovered, setHovered] = useState<string | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia("(pointer: fine)").matches;
  }, []);

  useEffect(() => {
    if (!fine.current) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (ghostRef.current) {
            ghostRef.current.style.transform = `translate(${x + 28}px, ${y - 120}px) rotate(2deg)`;
          }
        });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const img = hovered ? categoryImage[hovered] : null;

  return (
    <div onMouseLeave={() => setHovered(null)}>
      {/* cursor-following preview */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden w-56 overflow-hidden shadow-[0_24px_50px_rgba(32,40,31,0.35)] transition-opacity duration-300 lg:block"
        style={{ opacity: img ? 1 : 0 }}
      >
        {Object.values(categoryImage).map((ci) => (
          <div
            key={ci.src}
            className="relative aspect-[4/5]"
            style={{ display: img?.src === ci.src ? "block" : "none" }}
          >
            <Image src={ci.src} alt="" fill className="object-cover" sizes="224px" />
          </div>
        ))}
      </div>

      {vendors.map((group, gi) => (
        <Reveal key={group.category} delay={gi * 0.05}>
          <div
            className="group/row border-b border-ink/12 pb-9 pt-11 transition-colors duration-300 first:pt-0 hover:border-brass/60 md:pb-11 md:pt-14"
            onMouseEnter={() => setHovered(group.category)}
          >
            <p className="label text-brass">{group.category}</p>
            <ul className="mt-5 space-y-2 md:mt-6">
              {group.names.map((name) => (
                <li
                  key={name}
                  className="font-display text-2xl font-light tracking-wide transition-transform duration-300 md:text-3xl lg:group-hover/row:translate-x-2"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
