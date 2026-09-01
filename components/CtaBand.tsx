"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function CtaBand({
  image,
  alt,
  eyebrow,
  title,
  body,
  cta = "Book a Private Tour",
  href = "/tour",
  position = "center",
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body?: string;
  cta?: string;
  href?: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // glue the last two words so headlines never strand an orphan
  const glued = title.replace(/ (\S+)$/, " $1");

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
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/35 to-ink/30" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6 py-28 text-center">
        <Reveal className="scrim-radial">
          <p className="mb-7">
            <span className="tag">{eyebrow}</span>
          </p>
          <h2 className="font-display on-photo balance mx-auto max-w-3xl text-5xl font-light leading-[1.05] md:text-7xl">
            {glued}
          </h2>
          {body && (
            <p className="on-photo balance mx-auto mt-6 max-w-xl leading-relaxed">
              {body}
            </p>
          )}
          <Link
            href={href}
            className="label btn-fill btn-fill-dark mt-10 inline-block bg-cream px-9 py-4 text-ink"
          >
            {cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
