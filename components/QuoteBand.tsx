"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-cream">
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition: position }}
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-ink/55" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center md:py-44">
        <p className="font-display on-photo text-3xl font-light italic leading-snug md:text-[2.75rem] md:leading-[1.25]">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="label on-photo mt-10 text-brass-soft">
          {name} · {role}
        </p>
      </div>
    </section>
  );
}
