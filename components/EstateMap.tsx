"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The lay of the land: a hand-drawn map of the farm with the places a
 * wedding actually happens, laid out from the county plat (CUP 18-07,
 * Figure 1) and the aerial. North is up. Austerlitz Road runs along the top;
 * the drive enters at the north-west corner and runs down the west side past
 * the pond to the manor, a third of a mile in; the barn loop is south of the
 * house; the working stables sit on the east side. Not quite to scale.
 *
 * Interaction is React state plus CSS: the drive draws itself in, a marker
 * glides along the route to whichever stop is chosen, and the whole map
 * slips into golden hour when you reach the tent (or on demand).
 */

type Place = {
  key: string;
  n: string;
  name: string;
  short: string; // hand-lettered label on the map
  where: string;
  blurb: string;
  image: string;
  alt: string;
  pos?: string;
  cat: string;
  x: number; // the feature itself, viewBox coords (720 x 900)
  y: number;
  px: number; // where the numbered pin sits, beside the drawing
  py: number;
  lx?: number; // label offset from the pin
  ly?: number;
  end?: boolean; // label reads leftward from the pin
};

const places: Place[] = [
  {
    key: "gates",
    n: "01",
    name: "The Gates",
    short: "the gates",
    where: "On Austerlitz Road",
    blurb:
      "A stone gate at the top of the farm and a long drive running south between the fences. Everything opens up in front of you at once.",
    image: "/images/gates-allee.jpg",
    alt: "The stone gates and tree-lined drive",
    cat: "grounds",
    x: 168,
    y: 104,
    px: 122,
    py: 150,
    lx: -24,
    ly: 6,
    end: true,
  },
  {
    key: "pond",
    n: "02",
    name: "The Pond",
    short: "the pond",
    where: "Halfway down the drive",
    blurb:
      "Still water and a four-board fence just off the drive, the backdrop to every ceremony photograph and the best place on the farm to watch the sun go.",
    image: "/images/pond-spring.jpg",
    alt: "The pond in spring",
    cat: "grounds",
    x: 262,
    y: 418,
    px: 262,
    py: 364,
    lx: 24,
    ly: 6,
  },
  {
    key: "oak",
    n: "03",
    name: "The Great Oak",
    short: "the great oak",
    where: "On the lawn north of the manor",
    blurb:
      "Three hundred chairs fit in its shade. You say your vows here, the manor behind you and the pond and pasture beyond your guests.",
    image: "/images/oak-pasture.jpg",
    alt: "The great oak over the fence line and pasture",
    pos: "center 60%",
    cat: "ceremony",
    x: 306,
    y: 512,
    px: 354,
    py: 478,
    lx: 24,
    ly: 6,
  },
  {
    key: "manor",
    n: "04",
    name: "The Lary Manor",
    short: "the manor",
    where: "A third of a mile in",
    blurb:
      "Built in 1840 and still the heart of the place. Getting ready upstairs, portraits on the double porch, a quiet minute in the parlor before you walk out.",
    image: "/images/manor-porch-guests.jpg",
    alt: "Guests gathered before the manor's double porch",
    pos: "center 40%",
    cat: "manor",
    x: 204,
    y: 596,
    px: 136,
    py: 590,
    lx: -24,
    ly: 6,
    end: true,
  },
  {
    key: "tent",
    n: "05",
    name: "The Pool & Tented Lawn",
    short: "pool & tent",
    where: "Beside the manor",
    blurb:
      "Cocktail hour at the water, then dinner and dancing under sailcloth a few steps away, with the manor lit up across the pool.",
    image: "/images/tent-exterior-sky.jpg",
    alt: "The sailcloth tent set on the lawn",
    pos: "center 60%",
    cat: "tent",
    x: 318,
    y: 606,
    px: 394,
    py: 598,
    lx: 24,
    ly: 6,
  },
  {
    key: "cabin",
    n: "06",
    name: "The Log Cabin",
    short: "the cabin",
    where: "Steps from the house",
    blurb:
      "Raised in 1790, the oldest building on the farm, restored for the wedding party. Groomsmen on the porch, first looks in the shade beside it.",
    image: "/images/cabin-porch.jpg",
    alt: "The restored 1790 log cabin and its porch",
    pos: "center 62%",
    cat: "grounds",
    x: 238,
    y: 668,
    px: 204,
    py: 708,
    lx: -24,
    ly: 6,
    end: true,
  },
  {
    key: "barn",
    n: "07",
    name: "The Black Barn",
    short: "the black barn",
    where: "Down the lane, south of the house",
    blurb:
      "Rehearsal dinners, rainy-day ceremonies and the after-party. Chandeliers over a long table, doors open to the pasture, parking right beside it.",
    image: "/images/barn-lane.jpg",
    alt: "The lane leading to the black barn",
    cat: "barn",
    x: 372,
    y: 716,
    px: 418,
    py: 750,
    lx: 24,
    ly: 6,
  },
  {
    key: "stables",
    n: "08",
    name: "Stables & Paddocks",
    short: "the stables",
    where: "Across the pasture, east side",
    blurb:
      "Working thoroughbred country. Barns and turnout paddocks run down the east side of the farm, and the residents come to the fence for portraits.",
    image: "/images/horse-portrait.jpg",
    alt: "One of the estate's horses at the fence",
    cat: "grounds",
    x: 516,
    y: 388,
    px: 556,
    py: 352,
    lx: 24,
    ly: 6,
  },
];

const catLabel: Record<string, string> = {
  grounds: "the grounds",
  manor: "the manor",
  tent: "the tent",
  ceremony: "the ceremony",
  barn: "the barn",
};

// The route the marker follows: gates, down the drive, the manor loop, the
// cabin, the barn lane, then the farm track east and north to the stables.
const ROUTE =
  "M168 104 L174 140 L174 540 C174 566 186 580 206 584 L238 592 C266 598 276 622 258 642 C246 656 236 672 246 686 C258 700 300 708 350 712 L372 716 C400 718 418 704 416 690 L470 694 C512 698 536 676 538 636 L538 410 C538 396 528 388 516 388";

const trees: [number, number, number][] = [
  // west belt along the drive
  [146, 150, 9], [140, 190, 7], [148, 232, 10], [138, 276, 8], [146, 318, 9], [140, 362, 7],
  [148, 404, 10], [138, 448, 8], [146, 490, 9], [140, 530, 7],
  // around the pond
  [226, 392, 8], [300, 402, 9], [296, 440, 7], [228, 448, 6],
  // the event grounds are heavily treed
  [176, 572, 9], [172, 622, 8], [196, 646, 7], [280, 646, 8], [346, 640, 7], [338, 568, 8],
  [268, 560, 6], [216, 700, 7], [292, 700, 6],
  // east boundary and the far fields
  [580, 140, 9], [586, 210, 7], [578, 290, 10], [588, 470, 8], [580, 540, 9], [586, 620, 7],
  [578, 700, 10], [586, 780, 8], [470, 560, 8], [500, 600, 9], [440, 800, 7], [360, 830, 8],
  // north of the road, the neighbours
  [60, 24, 8], [110, 30, 6], [330, 22, 7], [470, 28, 9], [640, 24, 7], [700, 40, 8],
  // west neighbours
  [40, 300, 9], [70, 620, 8], [50, 760, 10], [90, 860, 7],
];

const horses: [number, number, number][] = [
  [392, 226, 1], [448, 268, -1], [500, 214, 1], [300, 806, 1], [452, 776, -1],
];

const fireflies: [number, number][] = [
  [290, 560], [330, 580], [268, 618], [352, 604], [310, 640], [250, 590], [380, 560], [300, 690],
];

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function EstateMap({
  onExplore,
}: {
  onExplore?: (cat: string) => void;
}) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState(false);
  const offsets = useRef<number[]>([]);
  const current = useRef(0);
  const raf = useRef(0);
  const place = places[active];

  const choose = useCallback((i: number) => setActive(i), []);
  const touchY = useRef<number | null>(null);
  // On phones a tap opens the stop full-screen; desktop keeps the side card.
  const openStop = useCallback(
    (i: number) => {
      choose(i);
      if (window.matchMedia("(max-width: 1023px)").matches) setSheet(true);
    },
    [choose]
  );
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [sheet]);

  // The marker is an HTML element moved with a composited transform, so the
  // SVG never repaints while it travels.
  const placeMarker = useCallback((x: number, y: number) => {
    const m = markerRef.current;
    const p = panelRef.current;
    if (!m || !p) return;
    m.style.transform = `translate3d(${(x / 720) * p.clientWidth}px, ${(y / 900) * p.clientHeight}px, 0)`;
  }, []);
  useEffect(() => {
    const onResize = () => {
      const path = routeRef.current;
      if (!path) return;
      const pt = path.getPointAtLength(current.current);
      placeMarker(pt.x, pt.y);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [placeMarker]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Find where along the route each stop sits, then glide the marker there.
  useEffect(() => {
    const path = routeRef.current;
    if (!path) return;
    if (!offsets.current.length) {
      const total = path.getTotalLength();
      const samples = 600;
      offsets.current = places.map((p) => {
        let best = 0;
        let bestD = Infinity;
        for (let s = 0; s <= samples; s++) {
          const len = (s / samples) * total;
          const pt = path.getPointAtLength(len);
          const d = (pt.x - p.x) ** 2 + (pt.y - p.y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = len;
          }
        }
        return best;
      });
    }
    const target = offsets.current[active];
    const start = current.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 0 : Math.min(2200, 600 + Math.abs(target - start) * 1.6);
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const len = start + (target - start) * ease(t);
      const pt = path.getPointAtLength(len);
      current.current = len;
      placeMarker(pt.x, pt.y);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active, placeMarker]);

  return (
    <section aria-labelledby="estate-map-title" className="mb-20 md:mb-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="label text-brass">The lay of the land</span>
          <h2
            id="estate-map-title"
            className="font-display balance mt-4 text-4xl font-light leading-[1.05] text-ink md:text-5xl"
          >
            Eighty acres, and where the day happens
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            Touch a place to see it. Laid out from the county plat and the
            aerial, so you can picture the walk before you take it.
          </p>
        </div>
        <p className="font-hand text-2xl text-ink-soft md:pb-1">
          north is up, and it is not quite to scale
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
        {/* Map */}
        <div
          ref={ref}
          className={`estate-map relative lg:col-span-7 ${inView ? "map-in" : ""}`}
        >
          <div ref={panelRef} className="elev-2 relative overflow-hidden">
            <svg
              viewBox="0 0 720 900"
              className="block h-auto w-full"
              role="img"
              aria-label="Hand-drawn map of the GlenLary Estate"
            >
              <defs>
                <radialGradient id="tentGlow">
                  <stop offset="0" stopColor="#e0b963" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#e0b963" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="houseGlow">
                  <stop offset="0" stopColor="#e0b963" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#e0b963" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="southFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--m-paper)" stopOpacity="0" />
                  <stop offset="1" stopColor="var(--m-paper)" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* paper and the neighbouring land */}
              <rect x="0" y="0" width="720" height="900" fill="var(--m-paper)" />
              <path d="M0 0 H720 V900 H0 Z" fill="var(--m-out)" />
              <g stroke="var(--m-line)" strokeOpacity="0.45" strokeWidth="1" fill="none">
                <path d="M0 330 C40 326 90 334 148 330" />
                <path d="M0 600 C50 596 100 604 148 600" />
                <path d="M572 260 C620 256 670 264 720 260" />
                <path d="M572 520 C620 516 670 524 720 520" />
                <path d="M572 760 C620 756 670 764 720 760" />
                <path d="M420 0 C424 20 418 40 422 62" />
              </g>

              {/* the farm: a long rectangle with a hand-drawn edge */}
              <path
                d="M150 96 C300 92 440 98 572 104 L574 460 C572 620 574 760 572 876 L150 874 C152 700 148 400 150 96 Z"
                fill="var(--m-field)"
                stroke="var(--m-ink)"
                strokeOpacity="0.45"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              {/* pasture patches */}
              <path d="M300 130 C400 126 470 132 556 138 L556 330 L300 336 Z" fill="var(--m-field2)" />
              <path d="M180 700 C300 696 440 700 556 706 L556 866 L180 862 Z" fill="var(--m-field2)" />
              <path d="M360 400 C420 396 480 404 530 406 L530 560 L360 566 Z" fill="var(--m-field2)" fillOpacity="0.6" />
              {/* the mown event lawn */}
              <path
                d="M186 470 C230 452 290 448 342 470 C372 486 376 540 366 590 C356 646 300 660 232 650 C196 640 176 600 180 556 C182 520 178 486 186 470 Z"
                fill="var(--m-lawn)"
              />

              {/* fences: rails plus post ticks */}
              <g fill="none" stroke="var(--m-fence)" strokeLinecap="round">
                <g strokeWidth="1.2">
                  <path d="M312 150 C390 146 470 150 552 154" />
                  <path d="M312 150 C310 210 314 270 312 330" />
                  <path d="M552 154 C554 210 550 270 552 330" />
                  <path d="M312 330 C390 326 470 330 552 334" />
                  <path d="M432 150 C434 210 430 270 432 330" />
                  <path d="M312 240 C390 236 470 240 552 244" />
                  <path d="M190 716 C300 712 440 716 552 720" />
                  <path d="M190 716 C192 770 188 820 190 858" />
                  <path d="M552 720 C554 770 550 820 552 858" />
                  <path d="M190 858 C300 854 440 858 552 862" />
                  <path d="M372 716 C374 770 370 820 372 858" />
                  <path d="M360 400 C420 396 480 404 530 406 L530 560 L360 566 Z" />
                  <path d="M212 384 L306 380" />
                  <path d="M180 470 L342 470" strokeOpacity="0.5" />
                </g>
                <g strokeWidth="4" strokeDasharray="1.4 13" strokeOpacity="0.9">
                  <path d="M312 150 C390 146 470 150 552 154" />
                  <path d="M312 330 C390 326 470 330 552 334" />
                  <path d="M190 716 C300 712 440 716 552 720" />
                  <path d="M190 858 C300 854 440 858 552 862" />
                  <path d="M312 150 C310 210 314 270 312 330" />
                  <path d="M552 154 C554 210 550 270 552 330" />
                  <path d="M190 716 C192 770 188 820 190 858" />
                  <path d="M552 720 C554 770 550 820 552 858" />
                </g>
              </g>

              {/* Austerlitz Road along the top */}
              <path d="M0 58 C240 50 480 62 720 72 L720 92 C480 82 240 70 0 78 Z" fill="var(--m-road)" />
              <g fill="none" stroke="var(--m-line)" strokeWidth="1.2">
                <path d="M0 58 C240 50 480 62 720 72" />
                <path d="M0 78 C240 70 480 82 720 92" />
              </g>
              <path
                d="M0 68 C240 60 480 72 720 82"
                fill="none"
                stroke="var(--m-house)"
                strokeWidth="1"
                strokeDasharray="10 9"
                strokeOpacity="0.9"
              />
              <text x="26" y="44" className="map-label" fontSize="20" fill="var(--m-ink)">
                Austerlitz Road
              </text>
              <text x="26" y="112" className="map-label" fontSize="15" fill="var(--m-soft)">
                to Clintonville
              </text>
              <g transform="translate(470 60)">
                <rect x="-16" y="-10" width="32" height="20" rx="3" fill="var(--m-house)" stroke="var(--m-ink)" strokeOpacity="0.6" />
                <text
                  y="4.5"
                  textAnchor="middle"
                  fontFamily="var(--font-jost), sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  fill="#16201a"
                >
                  57
                </text>
              </g>

              {/* the drive and the farm track: gravel underlay, brass route */}
              <path d={ROUTE} fill="none" stroke="var(--m-drive)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ROUTE} fill="none" stroke="var(--m-line)" strokeWidth="10.5" strokeOpacity="0.35" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 0" />
              <path d="M556 106 C558 200 556 300 552 356" fill="none" stroke="var(--m-drive)" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="216" cy="600" rx="30" ry="15" fill="none" stroke="var(--m-drive)" strokeWidth="8" />
              <ellipse cx="372" cy="716" rx="26" ry="13" fill="none" stroke="var(--m-drive)" strokeWidth="8" />
              <path
                ref={routeRef}
                className="map-drive"
                d={ROUTE}
                fill="none"
                stroke="#966b22"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2400"
              />
              {/* lanterns along the drive */}
              <g className="map-glow" fill="#e0b963">
                {[170, 240, 310, 380, 450, 520].map((y) => (
                  <circle key={y} cx="182" cy={y} r="1.8" />
                ))}
              </g>

              {/* tree shadows then trees */}
              <g fill="var(--m-shadow)">
                {trees.map(([x, y, r], i) => (
                  <ellipse key={i} cx={x + r * 0.5} cy={y + r * 0.55} rx={r} ry={r * 0.6} />
                ))}
              </g>
              <g>
                {trees.map(([x, y, r], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={r} fill={i % 3 === 0 ? "var(--m-tree2)" : "var(--m-tree)"} />
                    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.55} fill={i % 3 === 0 ? "var(--m-tree3)" : "var(--m-tree2)"} fillOpacity="0.7" />
                  </g>
                ))}
              </g>

              {/* the pond */}
              <path
                d="M232 398 C246 380 284 384 296 404 C310 426 296 448 270 452 C242 456 218 432 232 398 Z"
                fill="var(--m-water)"
                stroke="var(--m-water2)"
                strokeWidth="1.4"
              />
              <g fill="none" stroke="var(--m-water2)" strokeWidth="1" strokeLinecap="round">
                <path d="M248 418 C254 414 260 414 266 418" />
                <path d="M262 432 C268 428 274 428 280 432" />
              </g>
              <g stroke="var(--m-tree3)" strokeWidth="1" strokeLinecap="round">
                <path d="M236 396 L234 386" />
                <path d="M240 394 L240 383" />
                <path d="M296 446 L300 437" />
              </g>
              <circle cx="272" cy="414" r="1.6" fill="var(--m-house)" />
              <circle cx="278" cy="418" r="1.3" fill="var(--m-house)" />

              {/* the great oak, with chairs turned toward the manor */}
              <ellipse cx="316" cy="524" rx="30" ry="16" fill="var(--m-shadow)" />
              <circle cx="306" cy="512" r="24" fill="var(--m-tree2)" />
              <circle cx="296" cy="504" r="14" fill="var(--m-tree3)" fillOpacity="0.75" />
              <circle cx="316" cy="518" r="12" fill="var(--m-tree)" fillOpacity="0.9" />
              <g fill="var(--m-house)" stroke="var(--m-ink)" strokeOpacity="0.4" strokeWidth="0.5">
                {[0, 1, 2, 3].map((r) =>
                  [0, 1, 2, 3, 4].map((c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={262 + c * 6 + (c > 1 ? 6 : 0) + r * 1.5}
                      y={548 + r * 6}
                      width="3.4"
                      height="3.4"
                      transform={`rotate(-10 ${262 + c * 6} ${548 + r * 6})`}
                    />
                  ))
                )}
              </g>

              {/* the manor: white house, green roof ridge, columns to the north */}
              <g transform="translate(206 598) scale(1.28) translate(-206 -598)">
              <ellipse cx="230" cy="612" rx="34" ry="8" fill="url(#houseGlow)" className="map-glow" />
              <rect x="184" y="584" width="44" height="28" rx="1" fill="var(--m-house)" stroke="var(--m-ink)" strokeOpacity="0.55" strokeWidth="0.9" />
              <path d="M184 598 L228 598" stroke="var(--m-roof)" strokeWidth="1.2" />
              <rect x="184" y="584" width="44" height="6" fill="var(--m-roof)" fillOpacity="0.9" />
              {[190, 199, 208, 217].map((x) => (
                <rect key={x} x={x} y="581" width="2.4" height="4" fill="var(--m-house)" stroke="var(--m-ink)" strokeOpacity="0.5" strokeWidth="0.5" />
              ))}
              <circle cx="192" cy="586" r="1.4" fill="var(--m-ink)" fillOpacity="0.7" />
              <circle cx="222" cy="586" r="1.4" fill="var(--m-ink)" fillOpacity="0.7" />
              <g className="map-glow" fill="#e0b963">
                {[190, 199, 208, 217].map((x) => (
                  <rect key={x} x={x} y="603" width="3" height="4" />
                ))}
              </g>

              </g>
              {/* pool and lounge chairs */}
              <g transform="translate(261 601) scale(1.22) translate(-261 -601)">
              <rect x="248" y="592" width="26" height="13" rx="2" fill="var(--m-water)" stroke="var(--m-water2)" strokeWidth="1.2" />
              <rect x="252" y="609" width="5" height="2.4" fill="var(--m-house)" />
              <rect x="260" y="609" width="5" height="2.4" fill="var(--m-house)" />
              <rect x="268" y="609" width="5" height="2.4" fill="var(--m-house)" />

              </g>
              {/* the tent, glowing after dark */}
              <g transform="translate(322 604) scale(1.22) translate(-322 -604)">
              <ellipse cx="318" cy="612" rx="46" ry="26" fill="url(#tentGlow)" className="map-glow" />
              <path
                d="M292 606 L302 586 L312 606 L322 586 L332 606 L342 586 L352 606 L352 616 C342 620 302 620 292 616 Z"
                fill="var(--m-house)"
                stroke="#966b22"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <g stroke="#966b22" strokeWidth="0.7">
                <path d="M302 586 L302 580" />
                <path d="M322 586 L322 580" />
                <path d="M342 586 L342 580" />
              </g>
              <g fill="#b5583f">
                <path d="M302 580 L307 582 L302 584 Z" />
                <path d="M322 580 L327 582 L322 584 Z" />
                <path d="M342 580 L347 582 L342 584 Z" />
              </g>

              </g>
              {/* the log cabin */}
              <g transform="translate(238 667) scale(1.25) translate(-238 -667)">
              <rect x="228" y="660" width="20" height="14" rx="1" fill="var(--m-cabin)" stroke="var(--m-ink)" strokeOpacity="0.5" strokeWidth="0.8" />
              <path d="M228 667 L248 667" stroke="var(--m-ink)" strokeOpacity="0.35" strokeWidth="0.8" />
              <circle cx="244" cy="663" r="1.5" fill="var(--m-ink)" fillOpacity="0.7" />
              <rect x="236" y="671" width="4" height="3" fill="#e0b963" className="map-glow" />

              </g>
              {/* the black barn with its green roof and white doors */}
              <g transform="translate(376 706) scale(1.22) translate(-376 -706)">
              <rect x="352" y="694" width="42" height="24" rx="1" fill="var(--m-barn)" />
              <path d="M352 706 L394 706" stroke="var(--m-roof)" strokeWidth="1.6" />
              <rect x="352" y="694" width="42" height="5" fill="var(--m-roof)" />
              <g stroke="var(--m-house)" strokeWidth="0.9">
                <path d="M370 710 L376 716 M376 710 L370 716" />
              </g>
              <rect x="400" y="700" width="14" height="10" fill="none" stroke="var(--m-fence)" strokeWidth="0.8" strokeDasharray="2 2" />
              <rect x="360" y="722" width="4" height="4" fill="#e0b963" className="map-glow" />

              </g>
              {/* stables, round pen and run-in sheds on the east side */}
              <g transform="translate(512 384) scale(1.2) translate(-512 -384)">
              <rect x="498" y="366" width="34" height="16" rx="1" fill="var(--m-barn)" fillOpacity="0.85" />
              <rect x="498" y="366" width="34" height="4" fill="var(--m-roof)" />
              <rect x="506" y="390" width="22" height="11" rx="1" fill="var(--m-barn)" fillOpacity="0.7" />
              <circle cx="480" cy="392" r="12" fill="none" stroke="var(--m-fence)" strokeWidth="1.2" strokeDasharray="2 3" />
              <rect x="540" y="330" width="16" height="9" fill="var(--m-barn)" fillOpacity="0.6" />

              </g>
              {/* horses in the paddocks */}
              <g fill="var(--m-tree3)">
                {horses.map(([x, y, dir], i) => (
                  <g key={i} transform={`translate(${x} ${y}) scale(${dir * 0.9} 0.9)`}>
                    <ellipse cx="0" cy="6" rx="9" ry="2" fill="var(--m-shadow)" />
                    <path d="M-8 0 c1-4 4-6 8-6 h5 c1-3 4-4 6-2 l3 3 -1 2 -3 0 -1 3 -2 0 v6 h-2 v-5 h-6 v5 h-2 v-6 c-3 0 -5-2 -5-4z" />
                  </g>
                ))}
              </g>

              {/* fireflies, only at dusk */}
              <g fill="#e0b963">
                {fireflies.map(([x, y], i) => (
                  <circle key={i} className="firefly" cx={x} cy={y} r="1.6" style={{ animationDelay: `${i * 0.45}s` }} />
                ))}
              </g>

              {/* callouts: a thin leader from each pin to the place itself */}
              <g>
                {places.map((p, i) => (
                  <g key={p.key}>
                    <line
                      x1={p.px}
                      y1={p.py}
                      x2={p.x}
                      y2={p.y}
                      stroke="#966b22"
                      strokeWidth={i === active ? 1.5 : 1}
                      strokeDasharray="2 3"
                    />
                    <circle cx={p.x} cy={p.y} r={i === active ? 4 : 3} fill="#966b22" stroke="#fbfaf7" strokeWidth="1.2" />
                  </g>
                ))}
              </g>

              {/* hand-lettered labels */}
              <g className="hidden md:block">
                {places.map((p, i) => (
                  <text
                    key={p.key}
                    x={p.px + (p.lx ?? 24)}
                    y={p.py + (p.ly ?? 6)}
                    textAnchor={p.end ? "end" : "start"}
                    className="map-label"
                    data-on={i === active}
                    fontSize={i === active ? 20 : 17}
                  >
                    {p.short}
                  </text>
                ))}
                <text x="404" y="200" className="map-label" fontSize="16" fill="var(--m-soft)" textAnchor="middle">
                  paddocks
                </text>
                <text x="372" y="790" className="map-label" fontSize="16" fill="var(--m-soft)" textAnchor="middle">
                  south pastures
                </text>
                <text x="300" y="475" className="map-label" fontSize="14" fill="var(--m-soft)" textAnchor="middle">
                  ceremony lawn
                </text>
              </g>

              {/* cartouche and compass */}
              <g transform="translate(622 826)">
                <text textAnchor="middle" className="map-label" fontSize="21" fill="var(--m-ink)">
                  GlenLary Estate
                </text>
                <text
                  y="16"
                  textAnchor="middle"
                  fontFamily="var(--font-jost), sans-serif"
                  fontSize="8.5"
                  letterSpacing="1.6"
                  fill="var(--m-soft)"
                >
                  PARIS, KENTUCKY · EST. 1840
                </text>
                <text
                  y="30"
                  textAnchor="middle"
                  fontFamily="var(--font-jost), sans-serif"
                  fontSize="8.5"
                  letterSpacing="1.6"
                  fill="var(--m-soft)"
                >
                  EIGHTY ACRES
                </text>
              </g>
              <g transform="translate(622 742)" fill="none" stroke="var(--m-soft)" strokeWidth="1">
                <circle r="18" />
                <circle r="2" fill="var(--m-soft)" stroke="none" />
                <path d="M0 -14 L4 0 L0 -3 L-4 0 Z" fill="#966b22" stroke="none" />
                <path d="M0 14 L4 0 L0 3 L-4 0 Z" fill="var(--m-soft)" fillOpacity="0.5" stroke="none" />
                <path d="M-14 0 L0 -3 L14 0 L0 3 Z" fill="var(--m-soft)" fillOpacity="0.35" stroke="none" />
                <text y="-23" textAnchor="middle" fontFamily="var(--font-jost), sans-serif" fontSize="10" letterSpacing="2" fill="var(--m-ink)" stroke="none">
                  N
                </text>
              </g>
            </svg>

            {/* you, on the drive */}
            <div
              ref={markerRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 -ml-3 -mt-3 h-6 w-6 will-change-transform"
              style={{ transform: "translate3d(-100px, -100px, 0)" }}
            >
              <span className="map-you-halo absolute inset-0 rounded-full bg-brass-soft/40" />
              <span className="absolute inset-[3px] rounded-full bg-brass-soft/50" />
              <span className="absolute inset-[6px] rounded-full border-[1.6px] border-brass bg-cream" />
            </div>

            {/* pins */}
            {places.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => openStop(i)}
                  data-active={on}
                  aria-pressed={on}
                  aria-label={p.name}
                  style={{
                    left: `${(p.px / 720) * 100}%`,
                    top: `${(p.py / 900) * 100}%`,
                    animationDelay: `${0.5 + i * 0.16}s`,
                  }}
                  className={`map-pin absolute flex h-8 w-8 items-center justify-center rounded-full border font-label text-[10px] tracking-[0.12em] shadow-[0_2px_10px_rgba(22,32,26,0.22)] transition-colors duration-300 md:h-9 md:w-9 md:text-[11px] ${
                    on
                      ? "border-brass-soft bg-pine text-cream"
                      : "border-brass bg-cream text-pine hover:bg-pine hover:text-cream"
                  }`}
                >
                  {p.n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Place card */}
        <div className="lg:col-span-5">
          <div className="card-invite flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 md:px-8">
              <span className="label text-brass">Stop {place.n} of 08</span>
              <div className="flex gap-1.5">
                {places.map((p, i) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => choose(i)}
                    aria-label={p.name}
                    className={`h-1.5 w-5 transition-colors duration-300 ${
                      i === active ? "bg-pine" : "bg-ink/15 hover:bg-brass"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              key={place.key}
              className="gallery-item relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[300px] lg:flex-1"
            >
              <Image
                src={place.image}
                alt={place.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: place.pos ?? "center" }}
              />
            </div>

            <div className="flex flex-col px-6 pb-7 pt-6 md:px-8 md:pb-8">
              <span className="font-display text-base italic text-ink-soft">
                {place.where}
              </span>
              <h3 className="font-display balance mt-1 text-3xl font-light leading-tight text-pine md:text-4xl">
                {place.name}
              </h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{place.blurb}</p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => onExplore?.(place.cat)}
                  className="label btn-fill btn-fill-light bg-pine px-7 py-4 text-cream"
                >
                  See {catLabel[place.cat]}
                </button>
                <button
                  type="button"
                  onClick={() => choose((active + 1) % places.length)}
                  className="label link-sweep pb-1 text-brass"
                >
                  Next stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone: the stop, full screen. Close with the X, the button below,
          the Escape key, or a swipe down from the top. Nothing navigates. */}
      {sheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={place.name}
          className="map-sheet fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-cream text-ink lg:hidden"
          onTouchStart={(e) => {
            touchY.current = e.touches[0].clientY;
          }}
          onTouchMove={(e) => {
            if (touchY.current === null) return;
            const dy = e.touches[0].clientY - touchY.current;
            if (dy > 90 && e.currentTarget.scrollTop <= 0) {
              touchY.current = null;
              setSheet(false);
            }
          }}
          onTouchEnd={() => {
            touchY.current = null;
          }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur-sm">
            <span className="label text-brass">Stop {place.n} of 08</span>
            <button
              type="button"
              onClick={() => setSheet(false)}
              aria-label="Close"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors active:bg-pine active:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div key={place.key} className="gallery-item relative h-[42svh] min-h-[240px] w-full shrink-0">
            <Image
              src={place.image}
              alt={place.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: place.pos ?? "center" }}
            />
          </div>
          <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
            <span className="font-display text-base italic text-ink-soft">{place.where}</span>
            <h3 className="font-display balance mt-1 text-3xl font-light leading-tight text-pine">
              {place.name}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{place.blurb}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-6">
              <button
                type="button"
                aria-label="Previous stop"
                onClick={() => choose((active + places.length - 1) % places.length)}
                className="label flex h-12 w-14 items-center justify-center border border-ink/20 text-ink-soft active:bg-pine active:text-cream"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="label btn-fill btn-fill-light flex-1 bg-pine px-5 py-4 text-center text-cream"
              >
                Back to the map
              </button>
              <button
                type="button"
                aria-label="Next stop"
                onClick={() => choose((active + 1) % places.length)}
                className="label flex h-12 w-14 items-center justify-center border border-ink/20 text-ink-soft active:bg-pine active:text-cream"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
