"use client";

import { useEffect, useState } from "react";

/**
 * Opening ritual: deep-green curtain, the wordmark letterspaces in above a
 * drawn rule, then the whole panel lifts to reveal the gates. Once per session.
 */
export default function Intro() {
  const [state, setState] = useState<"idle" | "play" | "lift" | "done">("idle");

  useEffect(() => {
    if (
      sessionStorage.getItem("gl-intro") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setState("done");
      return;
    }
    sessionStorage.setItem("gl-intro", "1");
    setState("play");
    document.documentElement.style.overflow = "hidden";
    const t1 = setTimeout(() => setState("lift"), 2450);
    const t2 = setTimeout(() => {
      setState("done");
      document.documentElement.style.overflow = "";
    }, 3450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (state === "done" || state === "idle") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-pine text-cream"
      style={{
        transform: state === "lift" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <div
        className="flex flex-col items-center px-6 text-center"
        style={{
          opacity: state === "lift" ? 0 : 1,
          transition: "opacity 0.45s ease",
        }}
      >
        <span className="intro-the font-brand -mr-[0.6em] block text-xs tracking-[0.6em] opacity-0 md:text-sm">
          The
        </span>
        <span className="intro-name font-brand -mr-[0.14em] mt-3 block text-[9vw] font-medium leading-none opacity-0 sm:text-5xl md:text-6xl">
          GlenLary
        </span>
        <span className="intro-estate font-brand -mr-[0.5em] mt-4 block text-[3.4vw] opacity-0 sm:text-lg md:text-xl">
          Estate
        </span>
        <span className="intro-rule mt-7 block h-px w-0 bg-brass-soft/80" />
        <span className="intro-est label mt-6 !tracking-[0.5em] opacity-0">
          Est. 1840
        </span>
      </div>

      <style jsx>{`
        .intro-the {
          animation: introFade 0.9s ease 0.25s forwards;
        }
        .intro-name {
          letter-spacing: 0.35em;
          animation:
            introFade 1.1s ease 0.5s forwards,
            introTrack 1.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
        }
        .intro-estate {
          letter-spacing: 0.5em;
          animation: introFade 0.9s ease 0.95s forwards;
        }
        .intro-rule {
          animation: introRule 1.1s cubic-bezier(0.22, 1, 0.36, 1) 1.15s forwards;
        }
        .intro-est {
          animation: introFade 0.8s ease 1.5s forwards;
        }
        @keyframes introFade {
          to {
            opacity: 1;
          }
        }
        @keyframes introTrack {
          from {
            letter-spacing: 0.35em;
          }
          to {
            letter-spacing: 0.14em;
          }
        }
        @keyframes introRule {
          to {
            width: min(240px, 50vw);
          }
        }
      `}</style>
    </div>
  );
}
