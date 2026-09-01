"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Docked booking rail. Full-width pine bar with a brass rule, the estate on
 * the left and the ask on the right, so it reads as part of the house rather
 * than a floating app button. Appears once the page hero has left the screen.
 */
export default function StickyTour() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector("main section");
      if (hero) setShow(hero.getBoundingClientRect().bottom < 0);
      else setShow(window.scrollY > window.innerHeight * 1.2);
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
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t-2 border-brass-soft bg-pine px-5 py-3.5 text-cream shadow-[0_-10px_30px_rgba(24,28,23,0.28)] transition-transform duration-500 lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <span className="flex flex-col leading-tight">
        <span className="label !text-[0.55rem] !tracking-[0.3em] text-brass-soft">
          Private tours, 7 days
        </span>
        <span className="font-display mt-0.5 text-lg font-light italic">
          Come see the farm
        </span>
      </span>
      <span className="label flex shrink-0 items-center gap-2 border border-cream/50 px-4 py-2.5">
        Book a Tour
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
