"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const field =
  "w-full rounded-none border border-ink/20 bg-cream px-4 py-3.5 font-body text-base text-ink placeholder:text-ink/40 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors";

export default function TourForm({ presetWhen = "" }: { presetWhen?: string }) {
  const [sent, setSent] = useState(false);
  const [names, setNames] = useState("");
  const [type, setType] = useState("Wedding");
  const [when, setWhen] = useState(presetWhen);
  const [guests, setGuests] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "");
    const phone = String(f.get("phone") || "");
    const vision = String(f.get("vision") || "");

    const subject = `Private tour request · ${names || "New inquiry"}`;
    const lines: string[] = [
      `Hello Elizabeth,`,
      ``,
      `We would love to tour the GlenLary Estate.`,
      ``,
      `Names: ${names}`,
      `Email: ${email}`,
    ];
    if (phone) lines.push(`Phone: ${phone}`);
    lines.push(`Celebration: ${type}`);
    if (when) lines.push(`Timing in mind: ${when}`);
    if (guests) lines.push(`Estimated guests: ${guests}`);
    if (vision) lines.push(``, `About our day:`, vision);

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-ink/10 bg-white p-10 text-center shadow-[0_24px_60px_rgba(32,40,31,0.1)] md:p-14">
        <p className="font-display text-4xl font-light italic text-pine">
          Almost there
        </p>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink/85">
          Your email app just opened with everything filled in. Hit send, and
          Elizabeth will be in touch to set your tour date.
        </p>
        <p className="mt-6 text-sm text-ink/70">
          Nothing opened? Email us directly at{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
        </p>
      </div>
    );
  }

  // live summary of the day they are describing
  const summary = [
    type === "Something else entirely" ? "A celebration" : `A ${type.toLowerCase()}`,
    when && `in ${when}`,
    guests && `for ${guests} guests`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="overflow-hidden border border-ink/10 bg-white shadow-[0_24px_60px_rgba(32,40,31,0.1)]">
      <div className="bg-pine px-6 py-7 text-cream md:px-10">
        <p className="label text-brass-soft">Request your private tour</p>
        <p className="font-display mt-2 min-h-[2rem] text-2xl font-light italic leading-snug">
          {summary || "Tell us about your day"}
          {summary && <span className="not-italic"> at GlenLary.</span>}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 p-6 md:p-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="label mb-2 block text-ink/70">Your names</span>
            <input
              name="names"
              required
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Jordan & Casey"
              className={field}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="label mb-2 block text-ink/70">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={field}
              autoComplete="email"
              inputMode="email"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="label mb-2 block text-ink/70">
              Phone <span className="normal-case opacity-60">(optional)</span>
            </span>
            <input
              name="phone"
              type="tel"
              placeholder="(555) 555-5555"
              className={field}
              autoComplete="tel"
              inputMode="tel"
            />
          </label>
          <label className="block">
            <span className="label mb-2 block text-ink/70">Celebration</span>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${field} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%2320281f%22 stroke-width=%221.5%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
            >
              <option>Wedding</option>
              <option>Vow renewal</option>
              <option>Gala or fundraiser</option>
              <option>Corporate event</option>
              <option>Film or photo shoot</option>
              <option>Something else entirely</option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="label mb-2 block text-ink/70">
              Season or date in mind
            </span>
            <input
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="October 2027, flexible"
              className={field}
            />
          </label>
          <label className="block">
            <span className="label mb-2 block text-ink/70">
              Estimated guests
            </span>
            <input
              name="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="150"
              className={field}
              inputMode="numeric"
            />
          </label>
        </div>

        <label className="block">
          <span className="label mb-2 block text-ink/70">
            Tell us about your day
          </span>
          <textarea
            name="vision"
            rows={4}
            placeholder="Ceremony under the oak, dinner in the barn, everyone staying the weekend..."
            className={`${field} resize-none`}
          />
        </label>

        <button
          type="submit"
          className="label w-full bg-pine px-9 py-5 text-cream transition-colors duration-300 hover:bg-moss"
        >
          Request Your Tour
        </button>
        <p className="text-sm leading-relaxed text-ink/70">
          This opens a ready-to-send email to Elizabeth Lary, our events
          director. Prefer to write your own? Reach her any time at{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
