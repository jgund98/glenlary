"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Floating "Book a Tour" pill that appears once the visitor commits to scrolling. */
export default function StickyTour() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // appear only once the page's hero section has fully left the viewport
    const onScroll = () => {
      const hero = document.querySelector("main section");
      if (hero) {
        setShow(hero.getBoundingClientRect().bottom < 0);
      } else {
        setShow(window.scrollY > window.innerHeight * 1.2);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/tour") return null;

  return (
    <Link
      href="/tour"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`label fixed bottom-5 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-pine px-7 py-4 text-cream shadow-[0_12px_32px_rgba(29,35,28,0.35)] transition-all duration-500 hover:bg-moss lg:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      Book a Private Tour
    </Link>
  );
}
