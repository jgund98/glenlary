import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink text-cream">
      <Image
        src="/images/great-oak.jpg"
        alt=""
        fill
        className="object-cover opacity-40"
        sizes="100vw"
      />
      <div className="relative px-6 text-center">
        <p className="label text-brass-soft">Lost on the property</p>
        <h1 className="font-display mt-6 text-5xl font-light leading-tight md:text-7xl">
          This lane doesn&rsquo;t lead anywhere
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed opacity-85">
          Eighty acres, and you found the one path we didn&rsquo;t build. Head
          back toward the manor.
        </p>
        <Link
          href="/"
          className="label btn-fill btn-fill-dark mt-10 inline-block bg-cream px-9 py-4 text-ink"
        >
          Back to the Estate
        </Link>
      </div>
    </section>
  );
}
