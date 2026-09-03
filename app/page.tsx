import Image from "next/image";
import Link from "next/link";
import Arrival from "@/components/Arrival";
import QuoteBand from "@/components/QuoteBand";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import GhostWord from "@/components/GhostWord";
import Marquee from "@/components/Marquee";
import StickyTour from "@/components/StickyTour";
import WeddingReel from "@/components/WeddingReel";
import Backdrops from "@/components/Backdrops";
import AlbumDrop from "@/components/AlbumDrop";
import Residents from "@/components/Residents";
import { testimonials } from "@/lib/site";

const dayPreview = [
  {
    time: "Nine in the morning",
    caption: "Slow coffee, silk robes, happy nerves",
    image: "/images/morning-prep.jpg",
    position: "center 35%",
  },
  {
    time: "Half past four",
    caption: "Three hundred hearts under one oak",
    image: "/images/ceremony-oak-crowd.jpg",
    position: "center 52%",
  },
  {
    time: "Half past six",
    caption: "Sailcloth up, supper on the lawn",
    image: "/images/tent-exterior-sky.jpg",
    position: "center 55%",
  },
];

export default function Home() {
  return (
    <>
      <StickyTour />
      <Arrival />

      {/* Editorial introduction */}
      <section className="relative overflow-hidden bg-cream">
        <GhostWord
          text="1840"
          className="left-1/2 top-16 hidden -translate-x-1/2 text-[38vw] text-pine/[0.045] sm:block md:text-[26rem]"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
          <Reveal>
            <p className="ornament label mx-auto max-w-xs text-brass">
              <span className="whitespace-nowrap">Welcome home</span>
            </p>
          </Reveal>
          {/* three deliberate lines: free wrap broke "built / in 1840" */}
          <div className="mt-10 space-y-1 md:space-y-2">
            <MaskReveal
              className="font-display block text-[2rem] font-light leading-[1.2] sm:text-4xl md:text-6xl"
              delay={0.08}
            >
              Eighty acres of bluegrass.
            </MaskReveal>
            <MaskReveal
              className="font-display block text-[2rem] font-light leading-[1.2] sm:text-4xl md:text-6xl"
              delay={0.2}
            >
              A manor built in 1840.
            </MaskReveal>
            <MaskReveal
              className="font-display block text-[2rem] font-light italic leading-[1.2] text-moss sm:text-4xl md:text-6xl"
              delay={0.32}
            >
              One extraordinary day.
            </MaskReveal>
          </div>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-2xl text-left leading-loose text-ink-soft sm:text-center">
              The GlenLary Estate is a working horse farm in the heart of
              Kentucky horse country, twenty minutes from Lexington and a world
              away from everything else. Marry before the columns of the Lary
              Manor, dine in the black barn, dance under sailcloth and stars,
              and wake the next morning to horses grazing outside your window.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-16 grid grid-cols-2 gap-y-10 md:grid-cols-4">
              {[
                ["1840", "The manor rises"],
                ["80+", "Acres of bluegrass"],
                ["19", "Overnight guests"],
                ["20", "Minutes to Lexington"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display text-5xl font-light text-pine md:text-6xl">
                    {stat}
                  </p>
                  <p className="label mt-3 text-brass">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Backdrops />

      <WeddingReel />

      {/* One perfect day teaser */}
      <section className="relative overflow-hidden bg-cream">
        <GhostWord
          text="dawn to dark"
          className="right-[-4%] top-24 hidden text-[11rem] text-pine/[0.05] lg:block"
          drift={80}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="label text-brass">From first light to last lantern</p>
          </Reveal>
          <MaskReveal
            className="font-display mt-4 max-w-2xl text-4xl font-light leading-tight md:text-6xl"
            delay={0.08}
          >
            One perfect day
          </MaskReveal>
          <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-8">
            {dayPreview.map((d, i) => (
              <Reveal key={d.time} delay={i * 0.12}>
                <Link href="/weddings" className="group block text-center">
                  <div
                    className={`arch arch-frame relative overflow-hidden aspect-[3/4.2] ${
                      i === 1 ? "md:-translate-y-8" : ""
                    }`}
                  >
                    <Image
                      src={d.image}
                      alt={d.caption}
                      fill
                      className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                      style={{ objectPosition: d.position }}
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <p
                    className={`label pt-7 text-brass ${i === 1 ? "md:-translate-y-8" : ""}`}
                  >
                    {d.time}
                  </p>
                  <p
                    className={`font-display mt-2 text-2xl font-light ${i === 1 ? "md:-translate-y-8" : ""}`}
                  >
                    {d.caption}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-16 text-center md:mt-14">
              <Link
                href="/weddings"
                className="label btn-fill btn-fill-dark inline-block border border-ink/40 px-9 py-4"
              >
                Walk Through the Whole Day
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <QuoteBand
        image="/images/manor-guests-seated.jpg"
        alt="Guests seated before the manor"
        position="center 78%"
        quote={testimonials[0].quote}
        name={testimonials[0].name}
        role={testimonials[0].role}
      />

      {/* Occasions marquee */}
      <section className="border-y border-ink/10 bg-parchment text-pine">
        <Marquee
          items={[
            "Weddings",
            "Vow Renewals",
            "Black-Tie Galas",
            "Weekend Stays",
            "Corporate Retreats",
          ]}
        />
      </section>

      <AlbumDrop />

      <Residents />

      <CtaBand
        image="/images/ceremony-sunset-manor.jpg"
        alt="Ceremony chairs before the manor at golden hour"
        eyebrow="Private tours, seven days a week"
        title={"Come stand where it happens"}
        body="Photographs only get you so far. Walk the drive, climb the porch steps, and watch the light fall across the pastures. You will know."
        cta="Book a Private Tour"
        position="center 30%"
      />
    </>
  );
}
