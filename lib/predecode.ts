import { useEffect, type RefObject } from "react";

/**
 * Decode a section's photos before they are shown. A full-screen JPEG that
 * decodes on its first paint costs a phone 50-150ms, a visible hitch right
 * as a crossfade starts. This loads (lazy images included) and decodes every
 * <img> in the section once it comes within `margin` of the viewport, so the
 * first paint only has to draw.
 */
export function decodeAll(root: ParentNode | null) {
  if (!root) return;
  root.querySelectorAll("img").forEach((img) => {
    if (img.loading === "lazy") img.loading = "eager";
    const run = () => img.decode?.().catch(() => {});
    if (img.complete) run();
    else img.addEventListener("load", run, { once: true });
  });
}

export function usePredecode(
  ref: RefObject<HTMLElement | null>,
  margin = "150% 0px"
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          decodeAll(el);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
}
