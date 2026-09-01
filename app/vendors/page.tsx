import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import StickyTour from "@/components/StickyTour";
import VendorsList from "@/components/VendorsList";

export const metadata: Metadata = {
  title: "Preferred Vendors",
  description:
    "The planners, photographers, florists, and caterers who know the GlenLary Estate best, vetted across years of weddings on the farm.",
};

export default function VendorsPage() {
  return (
    <>
      <StickyTour />
      <PageHero
        image="/images/tent-long-table.jpg"
        alt="A king's table dressed the length of the sailcloth tent"
        eyebrow="Vetted over years of weddings"
        title="Preferred Vendors"
        sub="The people below have loaded in, set up, and shone here many times. They know our light, our layout, and our standards."
        position="center 45%"
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <VendorsList />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.15}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src="/images/bouquet.jpg"
                    alt="A pastel bouquet in full sun"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="relative mt-6 aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/cake-magnolia.jpg"
                    alt="A magnolia-trimmed wedding cake"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="card-invite mt-10 p-8">
                  <p className="font-display text-2xl font-light leading-snug">
                    Bringing your own team?
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/85">
                    Wonderful. Our estate liaison works hand in hand with
                    outside planners and vendors, and we are happy to walk them
                    through the property before the big day.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        image="/images/barn-tables.jpg"
        alt="Dinner tables set beneath the black barn doors"
        eyebrow="Assemble your dream team"
        title={"Great days are group projects"}
        body="Tell us your vision on the tour and we will point you to the people who can build it."
      />
    </>
  );
}
