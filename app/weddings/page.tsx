import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import DayTimeline from "@/components/DayTimeline";
import QuoteBand from "@/components/QuoteBand";
import StickyTour from "@/components/StickyTour";
import { site, testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Weddings & Events",
  description:
    "Weddings, vow renewals, galas, and corporate events on a historic Kentucky horse farm. Planning support from full in-house coordination to a dedicated estate liaison.",
};

const occasions = [
  {
    title: "Weddings",
    body: "From sophisticated casual to exclusively formal, against blue Kentucky sky and green pastures. The estate is yours: manor, barn, lawns, and all.",
    image: "/images/couple-porch.jpg",
    alt: "Newlyweds on the manor porch",
  },
  {
    title: "Vow renewals & anniversaries",
    body: "Reconfirm your vows to the love of your life somewhere worthy of the second promise, with the family that grew up in between.",
    image: "/images/couple-steps-fur.jpg",
    alt: "A couple on the manor steps",
  },
  {
    title: "Galas & fundraisers",
    body: "Black tie under sailcloth, bourbon in the parlor, and an address that does half your invitation's work for it.",
    image: "/images/tent-dinner.jpg",
    alt: "A formal dinner under the tent",
  },
  {
    title: "Corporate & film",
    body: "Retreats, launches, and productions have all set up on the farm. Eighty private acres hold a crew and its ambitions comfortably.",
    image: "/images/clear-tent.jpg",
    alt: "A clear-top tent with a checkered dance floor",
  },
];

const included = [
  {
    title: "The whole estate, exclusively",
    body: "One event at a time, always. The manor, the black barn, the lawns, the pool, and the drive are yours for the day.",
  },
  {
    title: "A morning-of address for everyone",
    body: "The bridal suite in the manor for her side, the cabin's hunting-lodge ease for his. Nobody gets ready in a hotel hallway.",
  },
  {
    title: "Rooms for nineteen",
    body: "Overnight accommodations across the manor and cabin keep your closest people on the property from rehearsal to farewell brunch.",
  },
  {
    title: "Ceremony sites for any size",
    body: "The great oak for three hundred, the front steps for fifty, the parlor for a vow whispered nearly in private.",
  },
  {
    title: "Planning, your way",
    body: "From full in-house planning and coordination to an estate liaison working alongside the planner you already trust.",
  },
  {
    title: "Kentucky, doing its part",
    body: "Grazing horses, a swan on the pond, golden light, and a star-filled sky no city can offer. These come standard.",
  },
];

export default function WeddingsPage() {
  return (
    <>
      <StickyTour />
      <PageHero
        image="/images/tent-long-table.jpg"
        alt="A king's table set under the sailcloth tent"
        eyebrow="Weddings · Galas · Private events"
        title="Weddings & Events"
        sub="One event at a time, one family behind it, and eighty acres arranged around your day."
      />

      {/* Intro */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className="ornament label mx-auto max-w-xs text-brass">
              <span className="whitespace-nowrap">How it works</span>
            </p>
            <MaskReveal
              className="font-display mt-10 text-4xl font-light leading-[1.15] md:text-6xl"
              delay={0.1}
            >
              You bring the occasion.{" "}
              <em className="text-moss">The estate brings everything it has.</em>
            </MaskReveal>
            <p className="mx-auto mt-8 max-w-2xl leading-loose text-ink/85">
              Events at GlenLary range from full in-house planning and
              coordination to our estate liaison working hand in hand with your
              own planner. Either way you get the same thing: a family that has
              hosted here for generations, and a farm that shows up
              breathtaking every single day.
            </p>
          </Reveal>
        </div>
      </section>

      <DayTimeline />

      {/* Occasions */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="label text-brass">Beyond weddings</p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl font-light leading-tight md:text-6xl">
              Every kind of celebration
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {occasions.map((o, i) => (
              <Reveal key={o.title} delay={(i % 2) * 0.1}>
                <div className={i % 2 === 1 ? "md:mt-16" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={o.image}
                      alt={o.alt}
                      fill
                      className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <h3 className="font-display mt-6 text-3xl font-light">
                    {o.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink/85">
                    {o.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="bg-pine text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="label text-brass-soft">What comes with the gates</p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl font-light leading-tight md:text-6xl">
              Yours for the day
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-cream/15 bg-cream/15 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <div key={item.title} className="bg-pine p-8 md:p-10">
                <Reveal delay={(i % 3) * 0.08}>
                  <p className="font-display text-xl italic text-brass-soft">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-light leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-90">
                    {item.body}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand
        image="/images/couple-columns-bw.jpg"
        alt="A couple beneath the manor columns"
        quote={testimonials[2].quote}
        name={testimonials[2].name}
        role={testimonials[2].role}
      />

      {/* Rates */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className="label text-brass">Rates & availability</p>
            <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl">
              Reserve your season
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-loose text-ink/85">
              The estate hosts a limited number of events each year, and
              autumn Saturdays are spoken for early. Tell us your season and
              your vision, and Elizabeth will send current rates and open
              dates.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/tour"
                className="label btn-fill btn-fill-light bg-pine px-9 py-4 text-cream"
              >
                Book a Private Tour
              </Link>
              <a
                href={`mailto:${site.email}?subject=Rates%20and%20availability%20at%20GlenLary`}
                className="label btn-fill btn-fill-dark border border-ink/40 px-9 py-4"
              >
                Request Rates
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
