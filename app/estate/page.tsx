import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import GhostWord from "@/components/GhostWord";
import Seasons from "@/components/Seasons";
import QuoteBand from "@/components/QuoteBand";
import CtaBand from "@/components/CtaBand";
import StickyTour from "@/components/StickyTour";
import { testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Estate",
  description:
    "Eighty acres of Kentucky bluegrass, the 1840 Lary Manor, the black barn, and a restored log cabin. Tour the grounds of the GlenLary Estate in Paris, Kentucky.",
};

export default function EstatePage() {
  return (
    <>
      <StickyTour />
      <PageHero
        image="/images/manor-golden-hero.jpg"
        alt="The Lary Manor at golden hour beneath the old trees"
        eyebrow="Paris, Kentucky · Bourbon County"
        title="The Estate"
        sub="Eighty acres of rolling bluegrass in the heart of horse country, twenty minutes from Lexington and nearly two centuries deep in Kentucky history."
      />

      {/* History intro */}
      <section className="relative overflow-hidden bg-cream">
        <GhostWord
          text="Since 1840"
          className="left-[-2%] top-16 hidden text-[10rem] text-pine/[0.05] lg:block"
          drift={70}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="label text-brass">Since 1840</p>
            <MaskReveal
              className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl"
              delay={0.08}
            >
              Some places are decorated with history. This one was{" "}
              <span data-keep>built from it.</span>
            </MaskReveal>
            <p className="mt-6 max-w-lg leading-loose text-ink-soft">
              The Lary Manor rose in 1840 and has watched nearly two centuries
              of Kentucky pass its columns: wars and derbies, droughts and
              christenings, and generation after generation of the Lary family,
              who still welcome every event here personally. The log cabin
              nearby is older still, reclaimed and restored to its rustic
              charm.
            </p>
            <p className="mt-4 max-w-lg leading-loose text-ink-soft">
              What you feel when you arrive is not a venue that opened for the
              season. It is a home that decided, after nearly two centuries, to
              share its best days.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <div className="frame-offset">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/manor-porch-detail.jpg"
                  alt="The manor porch with its green shutters, under an old tree"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            </div>
            <p className="label balance mt-6 max-w-xs text-ink-soft">
              The manor porch, behind its 180-year-old shade
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Manor */}
      <section id="manor" className="scroll-mt-24 bg-parchment">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="flex items-baseline gap-6">
              <span className="font-display text-7xl font-light italic text-brass md:text-8xl">
                I.
              </span>
              <div>
                <p className="label text-brass">The heart of the estate</p>
                <h2 className="font-display mt-2 text-4xl font-light md:text-6xl">
                  The Lary Manor
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mt-12 aspect-[16/9] overflow-hidden md:aspect-[21/9]">
              <Image
                src="/images/manor-front.jpg"
                alt="The Lary Manor in full summer, flag flying"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="leading-loose text-ink-soft">
                Marry on the front steps beneath the columns, host cocktails
                through the parlors, and let the double gallery hold your whole
                wedding party for the portrait everyone frames. Upstairs, the
                bridal suite gives the morning-of its own address: tall
                windows, deep light, and room for every robe and garment bag.
              </p>
              <p className="mt-4 leading-loose text-ink-soft">
                Intimate indoor gatherings fit the manor's elegant rooms as
                naturally as grand tented affairs fit its lawn, and overnight
                accommodations across the estate sleep up to nineteen of your
                nearest.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-3 lg:col-start-7">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/manor-parlor.jpg"
                  alt="Escort cards laid out beneath the parlor chandelier"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.18} className="lg:col-span-3">
              <div className="relative aspect-[3/4] overflow-hidden lg:mt-16">
                <Image
                  src="/images/manor-balcony.jpg"
                  alt="Newlyweds on the manor's upper gallery"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 40%" }}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Black Barn */}
      <section id="barn" className="scroll-mt-24 bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="flex items-baseline gap-6">
              <span className="font-display text-7xl font-light italic text-brass-soft md:text-8xl">
                II.
              </span>
              <div>
                <p className="label text-brass-soft">Kentucky's signature, kept</p>
                <h2 className="font-display mt-2 text-4xl font-light md:text-6xl">
                  The Black Barn
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/barn-moody.jpg"
                  alt="The black barn under a dramatic Kentucky sky"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col justify-between gap-8 lg:col-span-4">
              <div className="relative hidden aspect-[4/3] overflow-hidden lg:block">
                <Image
                  src="/images/barn-lounge.jpg"
                  alt="A velvet lounge inside the black barn"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
              <p className="leading-loose opacity-90">
                Every horse farm in the bluegrass paints its barns black. Ours
                just happens to set a beautiful table. Greenery chandeliers in
                the rafters, velvet lounges in the stalls' old footprint, and a
                gallery porch made for one very long dinner as the pastures go
                dark.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-4">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/barn-chandelier.jpg"
                  alt="A greenery chandelier hung in the barn loft"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4">
              <div className="relative aspect-[4/5] overflow-hidden lg:mt-12">
                <Image
                  src="/images/barn-long-table.jpg"
                  alt="A single long table down the barn gallery"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.16} className="lg:col-span-4">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/barn-aisle.jpg"
                  alt="An aisle runner to the black barn doors"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Cabin */}
      <section id="cabin" className="scroll-mt-24 bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="arch arch-frame relative mx-6 aspect-[3/4.2] overflow-hidden md:mx-10 lg:mx-4">
              <Image
                src="/images/cabin.jpg"
                alt="The restored log cabin in summer"
                fill
                className="object-cover"
                style={{ objectPosition: "42% 44%" }}
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="flex items-baseline gap-6">
                <span className="font-display text-7xl font-light italic text-brass md:text-8xl">
                  III.
                </span>
                <div>
                  <p className="label text-brass">The groom's quarters</p>
                  <h2 className="font-display mt-2 text-4xl font-light md:text-6xl">
                    The Cabin
                  </h2>
                </div>
              </div>
              <p className="mt-6 max-w-lg leading-loose text-ink-soft">
                Reclaimed log walls, a hunting-lodge easiness, and a kitchen
                guests describe as &ldquo;was this in a magazine?&rdquo; The
                cabin gives the groom and his groomsmen their own corner of the
                farm for the morning, and gives weekend guests a reason to
                fight over room assignments.
              </p>
              <p className="mt-4 max-w-lg leading-loose text-ink-soft">
                Between the manor and the cabin, the estate sleeps nineteen, so
                the people you love most never have to say goodnight and drive
                away.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <QuoteBand
        image="/images/couple-fence-lane.jpg"
        alt="A couple walking the fence-lined lane"
        quote={testimonials[5].quote}
        name={testimonials[5].name}
        role={testimonials[5].role}
      />

      {/* The Grounds */}
      <section id="grounds" className="scroll-mt-24 bg-parchment">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <div className="flex items-baseline gap-6">
              <span className="font-display text-7xl font-light italic text-brass md:text-8xl">
                IV.
              </span>
              <div>
                <p className="label text-brass">Eighty acres of backdrop</p>
                <h2 className="font-display mt-2 text-4xl font-light md:text-6xl">
                  The Grounds
                </h2>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-2xl leading-loose text-ink-soft">
              The great oak over the ceremony lawn. A pond with a resident
              swan. Paddocks of grazing horses, a pool for cocktail hour, and a
              night sky the city never touches. Photographers call the estate
              heaven; couples mostly just point.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {[
              { src: "/images/great-oak.jpg", alt: "The great oak on the ceremony lawn", label: "The great oak" },
              { src: "/images/pond-autumn-swan.jpg", alt: "The pond in autumn with its swan", label: "The pond" },
              { src: "/images/foal-fence.jpg", alt: "A foal at the four-board fence", label: "The residents" },
              { src: "/images/pool-tent.jpg", alt: "The pool beside the tented lawn", label: "The pool & lawn" },
            ].map((g, i) => (
              <Reveal key={g.label} delay={i * 0.07}>
                <div
                  className={`relative overflow-hidden aspect-[3/4] ${
                    i % 2 === 1 ? "lg:mt-12" : ""
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </div>
                <p className="label mt-3 text-ink-soft">{g.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Seasons />

      <CtaBand
        image="/images/gates-autumn.jpg"
        alt="The estate gates in autumn color"
        position="center 55%"
        eyebrow="See it with your own eyes"
        title={"The drive alone is worth the trip"}
        body="Private tours run seven days a week. Bring your people, bring your questions, and plan to stay a little longer than you meant to."
      />
    </>
  );
}
