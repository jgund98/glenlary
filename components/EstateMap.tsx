"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The lay of the land: an illustrated plat of the estate with the places a
 * wedding actually happens. Positions follow the deed and the aerial (the
 * farm sits north of Austerlitz Road at Clintonville; the drive runs up the
 * west side past the manor to the barns), drawn loosely rather than surveyed.
 *
 * Interaction is plain React state plus CSS: the drive draws itself in when
 * the section enters view, pins pop in behind it, the card answers each pin.
 */

type Place = {
  key: string;
  n: string;
  name: string;
  where: string;
  blurb: string;
  image: string;
  alt: string;
  pos?: string;
  cat: string;
  up?: boolean; // label sits above the pin
  x: number; // viewBox coords (720 x 900)
  y: number;
};

const places: Place[] = [
  {
    key: "gates",
    n: "01",
    name: "The Gates",
    where: "At the road",
    blurb:
      "Off Austerlitz Road, a stone gate and a drive lined with evergreens. The farm opens up in front of you all at once.",
    image: "/images/gates-allee.jpg",
    alt: "The stone gates and evergreen-lined drive",
    cat: "grounds",
    up: true,
    x: 160,
    y: 828,
  },
  {
    key: "manor",
    n: "02",
    name: "The Lary Manor",
    where: "Five hundred feet up the drive",
    blurb:
      "Built in 1840 and still the heart of the place. Getting ready upstairs, portraits on the double porch, a quiet minute in the parlor before you walk out.",
    image: "/images/manor-front.jpg",
    alt: "The white columned manor",
    cat: "manor",
    x: 196,
    y: 700,
  },
  {
    key: "tent",
    n: "03",
    name: "The Pool & Tented Lawn",
    where: "Beside the manor",
    blurb:
      "Cocktail hour at the water, then dinner and dancing under sailcloth a few steps away, with the manor lit up across the pool.",
    image: "/images/tent-pool-night.jpg",
    alt: "The sailcloth tent glowing over the pool at night",
    pos: "center 55%",
    cat: "tent",
    x: 322,
    y: 700,
  },
  {
    key: "cabin",
    n: "04",
    name: "The Log Cabin",
    where: "A short walk behind the house",
    blurb:
      "The oldest building on the farm, restored for the wedding party. Groomsmen on the porch, first looks in the shade beside it.",
    image: "/images/cabin.jpg",
    alt: "The restored log cabin",
    pos: "center 30%",
    cat: "grounds",
    x: 232,
    y: 612,
  },
  {
    key: "oak",
    n: "05",
    name: "The Great Oak",
    where: "On the east lawn",
    blurb:
      "Three hundred chairs fit in its shade. You say your vows here with the pond and the pasture behind you and the manor looking on.",
    image: "/images/great-oak.jpg",
    alt: "The great oak on the ceremony lawn",
    cat: "ceremony",
    x: 438,
    y: 650,
  },
  {
    key: "pond",
    n: "06",
    name: "The Pond",
    where: "Past the oak",
    blurb:
      "Still water and a four-board fence, the backdrop to every ceremony photograph and the best place on the farm to watch the sun go.",
    image: "/images/pond-spring.jpg",
    alt: "The pond in spring",
    cat: "grounds",
    x: 540,
    y: 586,
  },
  {
    key: "barn",
    n: "07",
    name: "The Black Barn",
    where: "A quarter mile up the drive",
    blurb:
      "Rehearsal dinners, rainy-day ceremonies and the after-party. Chandeliers over a long table, doors open to the pasture, parking right beside it.",
    image: "/images/barn-lane.jpg",
    alt: "The lane leading to the black barn",
    cat: "barn",
    x: 194,
    y: 332,
  },
  {
    key: "paddocks",
    n: "08",
    name: "Stables & Paddocks",
    where: "Beyond the barn",
    blurb:
      "Working thoroughbred country, another half mile of it rolling north. The residents come to the fence for portraits.",
    image: "/images/horse-portrait.jpg",
    alt: "One of the estate's horses at the fence",
    cat: "grounds",
    x: 348,
    y: 242,
  },
];

const catLabel: Record<string, string> = {
  grounds: "the grounds",
  manor: "the manor",
  tent: "the tent",
  ceremony: "the ceremony",
  barn: "the barn",
};

export default function EstateMap({
  onExplore,
}: {
  onExplore?: (cat: string) => void;
}) {
  const [active, setActive] = useState(1);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const place = places[active];

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

  return (
    <section aria-labelledby="estate-map-title" className="mb-20 md:mb-28">
      <div className="max-w-2xl">
        <span className="label text-brass">The lay of the land</span>
        <h2
          id="estate-map-title"
          className="font-display balance mt-4 text-4xl font-light leading-[1.05] text-ink md:text-5xl"
        >
          Eighty acres, and where the day happens
        </h2>
        <p className="mt-5 leading-relaxed text-ink-soft">
          Touch a place on the map to see it. Drawn from the deed and the
          aerial, so you can picture the walk before you take it.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
        {/* Map */}
        <div
          ref={ref}
          className={`relative lg:col-span-7 ${inView ? "map-in" : ""}`}
        >
          <div className="elev-2 relative overflow-hidden bg-parchment">
            <svg
              viewBox="0 0 720 900"
              className="block h-auto w-full"
              role="img"
              aria-label="Illustrated map of the GlenLary Estate"
            >
              <defs>
                <linearGradient id="northFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f1efe8" stopOpacity="1" />
                  <stop offset="1" stopColor="#f1efe8" stopOpacity="0" />
                </linearGradient>
                <pattern
                  id="hatch"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#16201a" strokeOpacity="0.08" />
                </pattern>
              </defs>

              {/* fields */}
              <rect x="0" y="0" width="720" height="900" fill="#f1efe8" />
              <path
                d="M118 40 H602 V830 H118 Z"
                fill="#1e5233"
                fillOpacity="0.07"
              />
              {/* neighbouring land, hatched */}
              <rect x="0" y="0" width="118" height="830" fill="url(#hatch)" />
              <rect x="602" y="0" width="118" height="830" fill="url(#hatch)" />

              {/* paddocks and pastures (fence lines) */}
              <g fill="none" stroke="#16201a" strokeOpacity="0.28" strokeDasharray="3 5">
                <rect x="290" y="120" width="150" height="86" />
                <rect x="452" y="150" width="130" height="96" />
                <rect x="140" y="420" width="120" height="120" />
                <rect x="300" y="300" width="160" height="110" />
                <rect x="470" y="300" width="112" height="150" />
                <line x1="118" y1="500" x2="602" y2="500" />
              </g>

              {/* ceremony lawn */}
              <ellipse cx="360" cy="690" rx="150" ry="72" fill="#1e5233" fillOpacity="0.1" />

              {/* pond */}
              <path
                d="M503 578 C511 552 553 546 577 566 C597 582 589 610 565 616 C537 624 491 610 503 578 Z"
                fill="#cfe0da"
                stroke="#6d8271"
                strokeWidth="1.2"
              />

              {/* trees: west boundary belt and around the water */}
              <g fill="#10331f" fillOpacity="0.22">
                {[
                  [132, 120], [140, 150], [128, 200], [142, 250], [130, 300], [138, 360],
                  [128, 560], [140, 600], [130, 700], [142, 740], [128, 780],
                  [588, 540], [596, 600], [560, 640], [590, 660],
                  [296, 560], [500, 706], [470, 746],
                  [560, 80], [582, 110], [596, 220], [470, 60], [500, 90],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 11 : 8} />
                ))}
              </g>

              {/* great oak */}
              <circle cx="438" cy="650" r="26" fill="#1e5233" fillOpacity="0.42" />
              <circle cx="438" cy="650" r="14" fill="#10331f" fillOpacity="0.5" />
              {/* chairs */}
              <g fill="#fbfaf7" stroke="#16201a" strokeOpacity="0.35" strokeWidth="0.6">
                {[0, 1, 2, 3].map((r) =>
                  [0, 1, 2, 3, 4, 5].map((c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={400 + c * 7 + (c > 2 ? 8 : 0)}
                      y={686 + r * 7}
                      width="4"
                      height="4"
                    />
                  ))
                )}
              </g>

              {/* the drive, drawn in */}
              <path
                d="M160 838 C158 780 166 720 168 660 C170 600 166 520 170 460 C174 400 172 360 178 330 C186 300 220 280 250 262 C280 244 268 190 262 120 L258 60"
                fill="none"
                stroke="#16201a"
                strokeOpacity="0.14"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                className="map-drive"
                d="M160 838 C158 780 166 720 168 660 C170 600 166 520 170 460 C174 400 172 360 178 330 C186 300 220 280 250 262 C280 244 268 190 262 120 L258 60"
                fill="none"
                stroke="#966b22"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* carriage loop */}
              <ellipse cx="200" cy="722" rx="34" ry="16" fill="none" stroke="#966b22" strokeWidth="1.4" />

              {/* evergreen allee along the road */}
              <g fill="#10331f" fillOpacity="0.55">
                {Array.from({ length: 16 }).map((_, i) => (
                  <circle key={i} cx={210 + i * 24} cy="812" r="5" />
                ))}
              </g>

              {/* manor */}
              <rect x="174" y="682" width="44" height="30" fill="#10331f" />
              <rect x="174" y="707" width="44" height="5" fill="#fbfaf7" fillOpacity="0.9" />
              {[178, 188, 198, 208].map((x) => (
                <rect key={x} x={x} y="702" width="3" height="10" fill="#fbfaf7" />
              ))}
              {/* cabin */}
              <rect x="223" y="606" width="18" height="13" fill="#b5583f" />
              {/* pool */}
              <rect x="262" y="706" width="24" height="12" fill="#cfe0da" stroke="#10331f" strokeOpacity="0.5" />
              {/* tent */}
              <path
                d="M306 714 L322 684 L338 714 L354 684 L370 714 L370 728 L306 728 Z"
                fill="#fbfaf7"
                stroke="#966b22"
                strokeWidth="1.2"
              />
              {/* barn, parking and outbuilding */}
              <rect x="150" y="286" width="90" height="22" fill="#16201a" fillOpacity="0.08" stroke="#16201a" strokeOpacity="0.3" strokeDasharray="2 3" />
              <rect x="172" y="318" width="46" height="28" fill="#16201a" />
              <rect x="172" y="318" width="46" height="6" fill="#1e5233" />
              <rect x="242" y="326" width="10" height="10" fill="#b5583f" />
              {/* stables */}
              <rect x="322" y="230" width="54" height="18" fill="#10331f" fillOpacity="0.75" />
              <rect x="330" y="256" width="32" height="14" fill="#10331f" fillOpacity="0.55" />

              {/* road */}
              <rect x="0" y="838" width="720" height="18" fill="#16201a" fillOpacity="0.14" />
              <line x1="0" y1="847" x2="720" y2="847" stroke="#fbfaf7" strokeWidth="1" strokeDasharray="10 8" />
              <text
                x="360"
                y="884"
                textAnchor="middle"
                fontFamily="var(--font-jost), sans-serif"
                fontSize="11"
                letterSpacing="3"
                fill="#4a5650"
              >
                AUSTERLITZ ROAD · KY 57
              </text>

              {/* north fade + note */}
              <rect x="0" y="0" width="720" height="150" fill="url(#northFade)" />
              <text
                x="360"
                y="74"
                textAnchor="middle"
                fontFamily="var(--font-cormorant), serif"
                fontStyle="italic"
                fontSize="19"
                fill="#4a5650"
              >
                the pastures run another half mile north
              </text>

              {/* compass */}
              <g transform="translate(662 96)" stroke="#4a5650" fill="none" strokeWidth="1">
                <circle r="16" />
                <path d="M0 -12 L5 4 L0 0 L-5 4 Z" fill="#966b22" stroke="none" />
                <text
                  y="-21"
                  textAnchor="middle"
                  fontFamily="var(--font-jost), sans-serif"
                  fontSize="10"
                  letterSpacing="2"
                  fill="#4a5650"
                  stroke="none"
                >
                  N
                </text>
              </g>
            </svg>

            {/* pins */}
            {places.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActive(i)}
                  data-active={on}
                  aria-pressed={on}
                  aria-label={`${p.name}`}
                  style={{
                    left: `${(p.x / 720) * 100}%`,
                    top: `${(p.y / 900) * 100}%`,
                    animationDelay: `${0.5 + i * 0.16}s`,
                  }}
                  className={`map-pin group absolute flex h-8 w-8 items-center justify-center rounded-full border font-label text-[11px] tracking-[0.12em] transition-colors duration-300 md:h-9 md:w-9 ${
                    on
                      ? "border-pine bg-pine text-cream"
                      : "border-brass bg-cream text-pine hover:bg-pine hover:text-cream"
                  }`}
                >
                  {p.n}
                  <span
                    className={`pointer-events-none absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap ${p.up ? "bottom-full mb-2" : "top-full mt-2"} bg-pine px-3 py-1.5 text-[10px] tracking-[0.18em] text-cream uppercase transition-opacity duration-300 md:block ${
                      on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {p.name}
                  </span>
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
                    onClick={() => setActive(i)}
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
                  onClick={() => setActive((a) => (a + 1) % places.length)}
                  className="label link-sweep pb-1 text-brass"
                >
                  Next stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
