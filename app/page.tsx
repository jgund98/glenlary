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
    time: "Almost midnight",
    caption: "Lanterns over the send-off",
    image: "/images/sky-lanterns.jpg",
    position: "center 40%",
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
        image="/images/party-porch-bw.jpg"
        alt="A wedding party across the manor's double gallery"
        quote={testimonials[0].quote}
        name={testimonials[0].name}
        role={testimonials[0].role}
        position="center 35%"
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

      {/* Estate life */}
      <section className="overflow-hidden bg-pine text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-0">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/horse-portrait.jpg"
                alt="One of GlenLary's horses leaning over the four-board fence"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-48 rotate-2 border border-cream/20 bg-ink/60 p-3 backdrop-blur-sm md:block lg:-right-10 lg:w-56">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/images/bride-flower-girls-horse.jpg"
                  alt="A bride and her flower girls meeting a paint horse at the fence"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "35% center" }}
                  sizes="220px"
                />
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <p className="label text-brass-soft">A farm first, always</p>
              <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl">
                Your other wedding guests have four legs
              </h2>
              <p className="mt-6 max-w-lg leading-loose opacity-85">
                GlenLary is no set piece. It is a working horse farm, and the
                residents like to make an appearance: at the fence during
                portraits, across the paddock during cocktail hour, silhouetted
                in the pasture as the sun goes down. Couples plan around a
                thousand details. The horses are the one nobody forgets.
              </p>
              <Link
                href="/estate"
                className="label btn-fill btn-fill-light mt-10 inline-block border border-cream/60 px-8 py-4"
              >
                Meet the Estate
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        image="/images/ceremony-sunset-manor.jpg"
        alt="Ceremony chairs before the manor at golden hour"
        eyebrow="Private tours, seven days a week"
        title={"Come stand where it happens"}
        body="Photographs only get you so far. Walk the drive, climb the porch steps, and watch the light fall across the pastures. You will know."
        cta="Book a Private Tour"
        position="center 30%"
      />
    </>
  );
}
