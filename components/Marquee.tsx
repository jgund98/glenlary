export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const row = items.map((t, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-12 md:mx-10">
      <span className="font-display text-5xl font-light italic md:text-7xl">
        {t}
      </span>
      <span className="inline-block h-2 w-2 rotate-45 bg-brass/70" />
    </span>
  ));

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden whitespace-nowrap py-10 md:py-14 ${className}`}
    >
      <div className="animate-marquee inline-block will-change-transform">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}
