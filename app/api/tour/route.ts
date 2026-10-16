import { NextResponse } from "next/server";
import { EMAIL_RE, brevoKey, sendLead } from "@/lib/lead-email";

/*
 * Tour requests -> email, via Epic's client email protocol.
 *
 * This route validates and hands off; lib/lead-email.ts builds and sends the
 * email, so the preview route renders exactly what gets sent.
 *
 * Requires BREVO_API_KEY. Without it the send no-ops and this returns 502, so
 * the visitor sees the "email Elizabeth directly" fallback instead of a false
 * success that swallows the inquiry.
 *
 * GET is a health check that never sends mail:
 *   GET /api/tour            -> is the key present
 *   GET /api/tour?verify=1   -> is it a working key (checked against Brevo's
 *                               account endpoint, which sends nothing)
 * Neither response ever includes the key.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function GET(req: Request) {
  const key = brevoKey();
  const configured = Boolean(key);
  if (!configured || !new URL(req.url).searchParams.has("verify")) {
    return NextResponse.json({ ok: true, configured });
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": key as string, accept: "application/json" },
    });
    // Brevo's own reason on failure ("Key not found", "unrecognised IP address"),
    // plus the key's shape, so a bad paste can be diagnosed without exposing it
    const reason = res.ok ? undefined : ((await res.json().catch(() => ({}))) as { message?: string }).message;
    const k = key as string;
    const shape = k.startsWith("xkeysib-") ? "xkeysib" : /^[A-Za-z0-9+/=]+$/.test(k) && k.length > 80 ? "base64-wrapped?" : "unexpected";
    return NextResponse.json({ ok: true, configured, keyValid: res.ok, brevoStatus: res.status, reason, keyShape: shape, keyLength: k.length, whitespace: k !== k.trim() });
  } catch {
    return NextResponse.json({ ok: true, configured, keyValid: false, brevoStatus: 0 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const d = (body ?? {}) as Record<string, unknown>;

  // honeypot: a hidden field people never see; bots fill every field
  if (str(d.company)) return NextResponse.json({ ok: true });

  const names = str(d.names, 200);
  const email = str(d.email, 200);
  if (!names || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "names and a valid email required" }, { status: 422 });
  }

  const res = await sendLead({
    names,
    email,
    phone: str(d.phone, 40),
    type: str(d.type, 80),
    when: str(d.when, 120),
    guests: str(d.guests, 40),
    vision: str(d.vision, 4000),
  });

  if (!res.ok) {
    console.error("[glenlary] tour email failed", { skipped: res.skipped, status: res.status, error: res.error, names, email });
    return NextResponse.json({ ok: false, error: "send failed" }, { status: 502 });
  }
  console.log("[glenlary] tour request emailed", { messageId: res.messageId, names });
  return NextResponse.json({ ok: true });
}
