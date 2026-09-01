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
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="label text-brass">Start here</p>
              <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-5xl">
                {when
                  ? `So, ${when} at GlenLary`
                  : "Tell us about your day"}
              </h2>
              <p className="mt-4 max-w-lg leading-loose text-ink/85">
                {when
                  ? "Wonderful choice. A few details and we will hold a morning or an evening for your visit."
                  : "A few details are all we need to set up your visit and pull current availability for your season."}
              </p>
              <div className="mt-10">
                <TourForm presetWhen={when ?? ""} />
              </div>

              <div className="mt-10 grid gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-3">
                {[
                  ["Thirty minutes", "Gates to porch to barn, at your pace"],
                  ["Bring anyone", "Parents, planners, and opinions welcome"],
                  ["Zero pressure", "Fall in love first. Numbers after."],
                ].map(([t, b]) => (
                  <div key={t} className="bg-cream p-6">
                    <p className="font-display text-xl font-light">{t}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.15}>
              <div className="arch arch-frame relative mx-4 aspect-[3/4.2] overflow-hidden">
                <Image
                  src="/images/gates-wreath.jpg"
                  alt="The white gates of the GlenLary Estate"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "62% center" }}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
              <div className="card-invite mt-8 space-y-6 p-8">
                <div>
                  <p className="label text-brass">Find us</p>
                  <p className="font-display mt-2 text-2xl font-light">
                    {site.location}
                  </p>
                  <p className="mt-1 text-sm text-ink/85">{site.region}</p>
                </div>
                <div>
                  <p className="label text-brass">Events & tours</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display mt-2 block break-all text-xl font-light underline-offset-4 hover:underline"
                  >
                    {site.email}
                  </a>
                  <p className="mt-1 text-sm text-ink/85">
                    Elizabeth Lary, events director
                  </p>
                </div>
                <div>
                  <p className="label text-brass">Follow along</p>
                  <div className="mt-2 flex gap-5">
                    <a
                      href={site.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      Instagram
                    </a>
                    <a
                      href={site.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
              <figure className="mt-8 border-l-2 border-brass pl-6">
                <blockquote className="font-display text-xl font-light italic leading-relaxed text-ink/85">
                  &ldquo;From the minute you pull up the long driveway, the
                  sprawling grounds just take your breath away.&rdquo;
                </blockquote>
                <figcaption className="label mt-3 text-ink/70">
                  {testimonials[1].name} · {testimonials[1].role}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-pine text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <p className="font-display text-3xl font-light italic leading-snug md:text-4xl">
              &ldquo;We look forward to hosting you at our home.&rdquo;
            </p>
            <p className="label mt-6 opacity-70">
              Diane & Elizabeth Lary · The GlenLary Estate
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
