"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
          solid
            ? "bg-cream/95 text-ink shadow-[0_1px_0_var(--line)] backdrop-blur-sm"
            : "bg-transparent text-cream"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link href="/" className="group flex flex-col items-center leading-none">
            <span className="font-brand -mr-[0.55em] text-[0.5rem] tracking-[0.55em] opacity-70 md:text-[0.55rem]">
              The
            </span>
            <span className="font-brand mt-1 text-[0.95rem] font-medium tracking-[0.18em] md:text-lg">
              GlenLary Estate
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`label relative pb-1 transition-opacity hover:opacity-100 ${
                  pathname === item.href
                    ? "opacity-100 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current"
                    : "opacity-90"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/tour"
              className={`label btn-fill border px-5 py-3 ${
                solid
                  ? "btn-fill-dark border-ink/40"
                  : "btn-fill-light border-cream/60"
              }`}
            >
              Book a Tour
            </Link>
          </nav>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <span
              className={`block h-px w-7 bg-current transition-transform duration-300 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-7 bg-current transition-transform duration-300 ${
                open ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* CSS-driven overlay: framer-motion v13 exit animations hang intermittently */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-cream text-ink transition-opacity duration-400 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center gap-1 px-8 pt-16">
          {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
            <div
              key={item.href}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(18px)",
                transition: `opacity 0.45s ease ${open ? 0.08 + i * 0.05 : 0}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${open ? 0.08 + i * 0.05 : 0}s`,
              }}
            >
              <Link
                href={item.href}
                tabIndex={open ? 0 : -1}
                className="font-display block py-2.5 text-4xl font-light tracking-wide"
              >
                {item.label}
              </Link>
            </div>
          ))}
          <div
            className="pt-6"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(18px)",
              transition: `opacity 0.45s ease ${open ? 0.45 : 0}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${open ? 0.45 : 0}s`,
            }}
          >
            <Link
              href="/tour"
              tabIndex={open ? 0 : -1}
              className="label inline-block border border-ink px-8 py-4"
            >
              Book a Private Tour
            </Link>
          </div>
        </div>
        <div className="relative h-36">
          <Image
            src="/images/pastures-golden.jpg"
            alt="Golden hour over the GlenLary pastures"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="flex items-center justify-between border-t border-ink/15 px-8 py-4">
          <span className="label opacity-70">{site.location}</span>
          <a href={`mailto:${site.email}`} className="label opacity-70" tabIndex={open ? 0 : -1}>
            Email us
          </a>
        </div>
      </div>
    </>
  );
}
