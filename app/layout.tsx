import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Jost, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import SmoothScroll from "@/components/SmoothScroll";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventsatglenlary.com"),
  title: {
    default: "The GlenLary Estate · Historic Kentucky Wedding Venue",
    template: "%s · The GlenLary Estate",
  },
  description:
    "A working horse farm and 1840 manor on 80 acres of Kentucky bluegrass, 20 minutes from Lexington. Weddings, galas, and private events at the GlenLary Estate in Paris, Kentucky.",
  openGraph: {
    title: "The GlenLary Estate",
    description:
      "Eighty acres of bluegrass. A manor built in 1840. One extraordinary day. Weddings and events in Kentucky horse country.",
    images: ["/images/manor-spring.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} ${jost.variable} ${playfair.variable} ${caveat.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EventVenue",
              name: "The GlenLary Estate",
              description:
                "A working horse farm and 1840 manor on 80 acres of Kentucky bluegrass, hosting weddings, galas, and private events.",
              foundingDate: "1840",
              email: "elizabeth@eventsatglenlary.com",
              url: "https://eventsatglenlary.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Paris",
                addressRegion: "KY",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.instagram.com/glenlaryestate/",
                "https://www.facebook.com/GlenLaryEstate/",
              ],
            }),
          }}
        />
        <Intro />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
