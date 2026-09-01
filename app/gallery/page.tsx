import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryClient from "@/components/GalleryClient";
import CtaBand from "@/components/CtaBand";
import StickyTour from "@/components/StickyTour";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real weddings and events at the GlenLary Estate: ceremonies under the great oak, dinners in the black barn, receptions under sailcloth, and the Kentucky grounds in every season.",
};

export default function GalleryPage() {
  return (
    <>
      <StickyTour />
      <PageHero
        image="/images/ceremony-oak-chairs.jpg"
        alt="White ceremony chairs circling the great oak"
        eyebrow="Real weddings, real light"
        title="The Gallery"
        sub="Every photograph below was taken on this farm. No styling required; the estate arrives camera-ready."
        position="center 72%"
      />
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <GalleryClient />
        </div>
      </section>
      <CtaBand
        image="/images/pastures-golden.jpg"
        alt="Golden hour over the GlenLary pastures"
        position="center 65%"
        eyebrow="Your chapter next"
        title={"Picture yourselves here"}
        body="A thirty-minute walk of the grounds says more than three hundred photographs. Come take the tour."
      />
    </>
  );
}
