import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import CtaBand from "@/components/CtaBand";
import StickyTour from "@/components/StickyTour";
import { testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Love Notes",
  description:
    "What brides, photographers, planners, and guests say after a day at the GlenLary Estate.",
};

const interleaved = [
  { src: "/images/reception-laugh-bw.jpg", alt: "A toast that landed at the reception" },
  { src: "/images/couple-walk-bw.jpg", alt: "Newlyweds walking the drive at sunset" },
  { src: "/images/bridesmaids-barn.jpg", alt: "The bridal party walking from the black barn" },
  { src: "/images/getaway-car-just-married.jpg", alt: "The just-married car heading down the drive" },
  { src: "/images/reception-toast-bride.jpg", alt: "The bride taking the microphone" },
];

export default function LoveNotesPage() {
  return (
    <>
      <StickyTour />
      <PageHero
        image="/images/reception-laugh-bw.jpg"
        alt="Laughter during the toasts under the tent"
        eyebrow="In their words"
        title="Love Notes"
        sub="Brides, photographers, planners, and guests, all trying to explain the same feeling."
        position="center 30%"
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          {testimonials.map((t, i) => (
            <div key={t.name}>
              <figure
                className={`py-14 md:py-20 ${i % 2 === 1 ? "md:pl-24 lg:pl-36" : "md:pr-24 lg:pr-36"}`}
              >
                <Reveal>
                  <span className="font-display block text-7xl font-light italic leading-none text-brass">
                    &ldquo;
                  </span>
                </Reveal>
                <blockquote>
                  {/* each testimonial speaks itself in, word by word */}
                  <MaskReveal
                    as="p"
                    stagger={0.015}
                    className="font-display mt-2 text-2xl font-light leading-[1.4] text-ink md:text-[2rem]"
                  >
                    {t.quote}
                  </MaskReveal>
                </blockquote>
                <Reveal delay={0.5}>
                  <figcaption className="label mt-8 text-ink/70">
                    {t.name} · {t.role}
                  </figcaption>
                </Reveal>
              </figure>
              {i < testimonials.length - 1 && interleaved[i] && (
                <Reveal delay={0.05}>
                  <div
                    className={`relative aspect-[16/9] overflow-hidden md:aspect-[21/9] ${
                      i % 2 === 0 ? "md:ml-24 lg:ml-36" : "md:mr-24 lg:mr-36"
                    }`}
                  >
                    <Image
                      src={interleaved[i].src}
                      alt={interleaved[i].alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 80vw, 100vw"
                    />
                  </div>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        image="/images/party-porch-bw.jpg"
        alt="A wedding party across the manor's double gallery"
        eyebrow="Write yours here"
        title={"The next note could be signed by you"}
        body="Every one of these stories started the same way: with a drive up to the gates. Book yours."
      />
    </>
  );
}
