"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

/**
 * Masked word-rise reveal for display headlines. Each word slides up out of
 * its own clipping box with a stagger, so lines break naturally at any width.
 */
export default function MaskReveal({
  children,
  className = "",
  as: Tag = "h2",
  stagger = 0.055,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Flatten children into segments; strings split into words, elements kept whole
  const segments: { node: ReactNode; key: number }[] = [];
  let k = 0;
  const push = (node: ReactNode) => segments.push({ node, key: k++ });
  const walk = (node: ReactNode, wrap?: ReactElement<{ children?: ReactNode }>) => {
    if (typeof node === "string") {
      node
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w) =>
          push(wrap ? cloneElement(wrap, { key: k, children: w }) : w)
        );
    } else if (Array.isArray(node)) {
      node.forEach((n) => walk(n, wrap));
    } else if (isValidElement(node)) {
      const props = node.props as { children?: ReactNode; "data-keep"?: boolean };
      if (props["data-keep"]) {
        // keep as one segment (e.g. a phrase that must not break across lines)
        push(node);
        return;
      }
      // split words inside inline wrappers (em/strong/span) so lines can break
      walk(props.children, node as ReactElement<{ children?: ReactNode }>);
    } else if (node !== null && node !== undefined && node !== false) {
      push(node);
    }
  };
  walk(children);

  return (
    <Tag ref={ref as never} className={className} aria-label={undefined}>
      {segments.map((seg, i) => (
        <span
          key={seg.key}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <span
            className="inline-block will-change-transform"
            style={{
              transform: shown ? "translateY(0)" : "translateY(112%)",
              transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${
                delay + i * stagger
              }s`,
            }}
          >
            {seg.node}
          </span>
          {i < segments.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
