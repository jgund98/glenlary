"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";

/**
 * Editorial quote: words live on a solid pine panel, the photograph answers
 * beside them. Nothing sits on top of the image.
 */
export default function QuoteBand({
  image,
  alt,
  quote,
  name,
  role,
  position = "center",
}: {
  image: string;
  alt: string;
  quote: string;
  name: string;
  role: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="bg-pine text-cream">
      <div className="grid lg:grid-cols-12">
        {/* The words, on solid ground */}
        <div className="relative flex items-center lg:col-span-7">
          <div className="relative w-full px-6 py-20 sm:px-10 md:px-14 md:py-28 lg:py-32 xl:px-20">
            <Reveal>
              <span
                aria-hidden
                className="font-display block text-8xl font-light italic leading-[0.5] text-brass-soft"
              >
                &ldquo;
              </span>
              <blockquote className="font-display mt-6 max-w-2xl text-2xl font-light italic leading-[1.45] text-cream sm:text-3xl md:text-[2.1rem]">
                {quote}
              </blockquote>
              {/* name and role stack so neither strands a word */}
              <figcaption className="mt-9 border-l-2 border-brass-soft pl-5">
                <span className="label block text-cream">{name}</span>
                <span className="mt-1.5 block font-body text-sm italic text-brass-soft">
                  {role}
                </span>
              </figcaption>
            </Reveal>
          </div>
          {/* hairline detail echoing the invitation frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-4 border border-cream/10 md:inset-6"
          />
        </div>

        {/* The photograph, untouched */}
        <div className="relative min-h-[340px] overflow-hidden sm:min-h-[420px] lg:col-span-5 lg:min-h-[560px]">
          <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover"
              style={{ objectPosition: position }}
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
