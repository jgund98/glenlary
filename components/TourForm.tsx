"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function TourForm({ presetWhen = "" }: { presetWhen?: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fallbackHref, setFallbackHref] = useState("");
  const [names, setNames] = useState("");
  const [type, setType] = useState("Wedding");
  const [when, setWhen] = useState(presetWhen);
  const [guests, setGuests] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const f = new FormData(e.currentTarget);
    setSending(true);
    setFailed(false);
    const email = String(f.get("email") || "");
    const phone = String(f.get("phone") || "");
    const vision = String(f.get("vision") || "");
    // if sending fails, the visitor can still send it all as a prefilled email
    const lines = [
      "Hello Elizabeth,",
      "",
      "We would love to tour the GlenLary Estate.",
      "",
      `Names: ${names}`,
      `Email: ${email}`,
      ...(phone ? [`Phone: ${phone}`] : []),
      `Celebration: ${type}`,
      ...(when ? [`Timing in mind: ${when}`] : []),
      ...(guests ? [`Estimated guests: ${guests}`] : []),
      ...(vision ? ["", "About our day:", vision] : []),
    ];
    const subject = `Private tour request · ${names || "New inquiry"}`;
    setFallbackHref(
      `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`
    );
    try {
      const res = await fetch("/api/tour", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          names,
          email,
          phone,
          type,
          when,
          guests,
          vision,
          company: String(f.get("company") || ""),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      // nothing is lost: the form keeps every answer and offers a direct email
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="card-invite p-10 text-center md:p-14">
        <p className="font-display text-4xl font-light italic text-pine">
          Thank you
        </p>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-ink-soft">
          Your request is in. Elizabeth will be in touch shortly to set your
          tour date.
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
    <div className="card-invite flex h-full flex-col">
      <div className="relative border-b border-ink/10 px-7 pb-7 pt-8 text-center md:px-12">
        <span className="tag tag-center tag-ink">Request your private tour</span>
        <p className="font-display mt-5 min-h-[2.25rem] text-2xl font-light italic leading-snug text-pine md:text-[1.7rem]">
          {summary ? (
            <>
              {summary}
              <span className="not-italic"> at GlenLary.</span>
            </>
          ) : (
            "Tell us about your day."
          )}
        </p>
        <span
          aria-hidden
          className="mx-auto mt-5 block h-2 w-2 rotate-45 bg-brass/70"
        />
      </div>

      <form onSubmit={onSubmit} className="relative flex flex-1 flex-col space-y-9 px-7 py-9 md:px-12 md:py-11">
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-10">
          <label className="block">
            <span className="label mb-1 block text-brass">Your names</span>
            <input
              name="names"
              required
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Jordan & Casey"
              className="field-line"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="label mb-1 block text-brass">Email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="field-line"
              autoComplete="email"
              inputMode="email"
            />
          </label>
        </div>

        <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-10">
          <label className="block">
            <span className="label mb-1 block text-brass">
              Phone <span className="normal-case opacity-60">(optional)</span>
            </span>
            <input
              name="phone"
              type="tel"
              placeholder="(555) 555-5555"
              className="field-line"
              autoComplete="tel"
              inputMode="tel"
            />
          </label>
          <label className="block">
            <span className="label mb-1 block text-brass">Celebration</span>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="field-line cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22><path d=%22M5 1l4 4-4 4-4-4z%22 fill=%22%23966b22%22/></svg>')] bg-[right_0.25rem_center] bg-no-repeat pr-8"
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

        <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-10">
          <label className="block">
            <span className="label mb-1 block text-brass">
              Season or date in mind
            </span>
            <input
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="October 2027, flexible"
              className="field-line"
            />
          </label>
          <label className="block">
            <span className="label mb-1 block text-brass">
              Estimated guests
            </span>
            <input
              name="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="150"
              className="field-line"
              inputMode="numeric"
            />
          </label>
        </div>

        <label className="block">
          <span className="label mb-1 block text-brass">
            Tell us about your day
          </span>
          <textarea
            name="vision"
            rows={3}
            placeholder="Ceremony under the oak, dinner in the barn, everyone staying the weekend..."
            className="field-line resize-none"
          />
        </label>

        <div className="mt-auto pt-1">
          <button
            type="submit"
            disabled={sending}
            aria-busy={sending}
            className="label btn-fill btn-fill-light w-full bg-pine px-9 py-5 text-cream disabled:cursor-wait disabled:opacity-80"
          >
            {sending ? "Sending" : "Request Your Tour"}
          </button>
          {failed && (
            <p role="alert" className="mt-4 text-center text-sm leading-relaxed text-ink-soft">
              That didn&rsquo;t go through. Please try again, or{" "}
              <a href={fallbackHref || `mailto:${site.email}`} className="text-brass underline underline-offset-4">
                send it by email instead
              </a>
              . Everything you wrote comes along.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
