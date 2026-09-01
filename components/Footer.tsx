import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-pine text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-brand text-2xl font-medium tracking-[0.18em] md:text-[1.7rem] md:tracking-[0.22em]">
              The GlenLary Estate
            </p>
            <p className="label mt-3 opacity-60">Est. 1840 · Bourbon County, Kentucky</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-90">
              A working horse farm and historic manor on eighty acres of
              bluegrass in Paris, Kentucky, twenty minutes from Lexington.
            </p>
          </div>

          <div>
            <p className="label mb-5 opacity-60">Visit</p>
            <ul className="space-y-3">
              {[...nav, { href: "/tour", label: "Book a Tour" }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-xl font-light tracking-wide transition-opacity hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-5 opacity-60">Say hello</p>
            <a
              href={`mailto:${site.email}`}
              className="font-display block break-all text-xl font-light tracking-wide transition-opacity hover:opacity-70"
            >
              {site.email}
            </a>
            <p className="mt-4 text-sm opacity-90">
              {site.location}
              <br />
              {site.region}
            </p>
            <div className="mt-6 flex gap-6">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="label opacity-70 transition-opacity hover:opacity-100"
              >
                Instagram
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                className="label opacity-70 transition-opacity hover:opacity-100"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs opacity-60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} The GlenLary Estate. All rights
            reserved.
          </p>
          <p className="font-display text-sm italic tracking-wide">
            The bluegrass will be waiting.
          </p>
        </div>
      </div>
    </footer>
  );
}
