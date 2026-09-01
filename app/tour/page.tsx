import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TourForm from "@/components/TourForm";
import { site, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Tour",
  description:
    "Book a private tour of the GlenLary Estate in Paris, Kentucky. Walk the drive, the manor, the black barn, and the grounds with the Lary family.",
};

export default async function TourPage({
  searchParams,
}: {
  searchParams: Promise<{ when?: string }>;
}) {
  const { when } = await searchParams;

  return (
    <>
      <PageHero
        image="/images/estate-approach.jpg"
        alt="The manor at the end of the long drive"
        eyebrow="Private tours, seven days a week"
        title="Book a Tour"
        sub="Thirty unhurried minutes on the farm. Bring anyone whose opinion matters, and let the grounds do the rest."
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          {/* one heading over both columns, so the pair reads as one spread */}
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="label text-brass">Start here</p>
              <h2 className="font-display balance mt-4 text-4xl font-light leading-tight md:text-5xl">
                {when ? `So, ${when} at GlenLary` : "Tell us about your day"}
              </h2>
              <p className="balance mx-auto mt-4 max-w-lg leading-loose text-ink-soft">
                {when
                  ? "Wonderful choice. A few details and we will hold a morning or an evening for your visit."
                  : "A few details are all we need to set up your visit and pull current availability for your season."}
              </p>
              <span
                aria-hidden
                className="mx-auto mt-8 block h-2 w-2 rotate-45 bg-brass/70"
              />
            </div>
          </Reveal>

          {/* invitation on the left, the estate's calling card on the right,
              both cards starting on the same line */}
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-7">
              <TourForm presetWhen={when ?? ""} />
            </Reveal>

            <Reveal delay={0.12} className="lg:col-span-5">
              <div className="card-invite overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/gates-allee.jpg"
                    alt="The white gates and the long allee to the manor"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "center 55%" }}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5">
                    <span className="tag">The gates, Paris KY</span>
                  </div>
                </div>

                <div className="space-y-7 p-8 md:p-9">
                  <div>
                    <p className="label text-brass">Find us</p>
                    <p className="font-display mt-2 text-2xl font-light">
                      {site.location}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">{site.region}</p>
                  </div>
                  <div className="border-t border-ink/12 pt-7">
                    <p className="label text-brass">Events &amp; tours</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="font-display mt-2 block break-all text-xl font-light underline-offset-4 hover:underline"
                    >
                      {site.email}
                    </a>
                    <p className="mt-1 text-sm text-ink-soft">
                      Elizabeth Lary, events director
                    </p>
                  </div>
                  <div className="border-t border-ink/12 pt-7">
                    <p className="label text-brass">Follow along</p>
                    <div className="mt-3 flex gap-6">
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="link-sweep relative text-sm"
                      >
                        Instagram
                      </a>
                      <a
                        href={site.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="link-sweep relative text-sm"
                      >
                        Facebook
                      </a>
                    </div>
                  </div>
                  <figure className="border-t border-ink/12 pt-7">
                    <blockquote className="font-display text-lg font-light italic leading-relaxed text-ink-soft">
                      &ldquo;From the minute you pull up the long driveway, the
                      sprawling grounds just take your breath away.&rdquo;
                    </blockquote>
                    <figcaption className="label mt-3 text-brass">
                      {testimonials[1].name}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </Reveal>
          </div>

          {/* the promise, spanning the full spread */}
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-px overflow-hidden border border-ink/12 bg-ink/12 sm:grid-cols-3">
              {[
                ["Thirty minutes", "Gates to porch to barn, at your pace"],
                ["Bring anyone", "Parents, planners, and opinions welcome"],
                ["Zero pressure", "Fall in love first. Numbers after."],
              ].map(([t, b]) => (
                <div key={t} className="bg-cream p-7">
                  <p className="font-display text-xl font-light">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-pine text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-display balance text-3xl font-light italic leading-snug md:text-4xl">
              &ldquo;We look forward to hosting you at our home.&rdquo;
            </p>
            <p className="label mt-6 text-brass-soft">
              Diane &amp; Elizabeth Lary
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
