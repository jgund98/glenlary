import Image from "next/image";

export default function PageHero({
  image,
  alt,
  eyebrow,
  title,
  sub,
  position = "center",
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  sub?: string;
  position?: string;
}) {
  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-ink text-cream md:min-h-[80vh]">
      <div className="kenburns absolute inset-0">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: position }}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/35" />
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 md:px-8 md:pb-24">
        <p className="mb-6">
          <span className="tag">{eyebrow}</span>
        </p>
        <h1 className="font-display on-photo balance max-w-4xl text-5xl font-light leading-[1.02] md:text-8xl">
          {title}
        </h1>
        {sub && (
          <p className="on-photo mt-6 max-w-xl leading-relaxed">{sub}</p>
        )}
      </div>
    </section>
  );
}
