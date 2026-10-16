/*
 * Epic's client email protocol: tour-request notifier (Brevo transactional
 * API), skinned to the estate.
 *
 * BREVO_API_KEY is the ONLY environment variable this needs. It is the only
 * secret; who the mail goes to and who it comes from are facts about this
 * client, so they live here as defaults. Each still honours an env var of the
 * same name, so the recipient can be changed without a deploy.
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/*
 * The Brevo key from the environment, unwrapped if needed. Brevo's "API keys &
 * MCP" page hands out a base64 blob (JSON holding the real xkeysib-... key);
 * pasting that blob looks right but 401s with "Key not found". Accept both.
 */
export function brevoKey(): string | undefined {
  const raw = process.env.BREVO_API_KEY?.trim();
  if (!raw || raw.startsWith("xkeysib-")) return raw;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const fromJson = (JSON.parse(decoded) as { api_key?: string }).api_key;
    if (fromJson?.startsWith("xkeysib-")) return fromJson.trim();
  } catch {
    const m = Buffer.from(raw, "base64").toString("utf8").match(/xkeysib-[A-Za-z0-9-]+/);
    if (m) return m[0];
  }
  return raw;
}

/* Inquiries go to Jordan for now; switch to elizabeth@eventsatglenlary.com
   (or set LEAD_TO_EMAIL in Vercel) when she takes them over. Comma-separate
   to send to more than one inbox. */
const TO_EMAIL = process.env.LEAD_TO_EMAIL || "jgundyt@gmail.com";
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "noreply@epicdevsolutions.com";
const FROM_NAME = process.env.LEAD_FROM_NAME || "The GlenLary Estate";

/** What the tour form collects. */
export type TourLead = {
  names: string;
  email: string;
  phone?: string;
  type?: string;
  when?: string;
  guests?: string;
  vision?: string;
};

type Field = { label: string; value?: string; empty?: string | null; tel?: boolean; mailto?: boolean };
type Section = { title: string; fields: Field[] };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );

const digits = (s: string) => s.replace(/\D/g, "");

/** E.164 for a US number, however the visitor typed it. */
const telHref = (raw: string) => {
  const d = digits(raw).replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `tel:+1${d}` : `tel:${digits(raw)}`;
};

/** (859) 555-0123 from any of the ways a person might type it. */
export function prettyPhone(raw: string): string {
  const d = digits(raw).replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : raw;
}

/* Email clients strip <style> and most CSS, so everything is inline and the
   layout is tables. The palette is the site's: pine, brass on light, paper. */
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
const C = {
  ink: "#16201a",
  body: "#33403a",
  muted: "#7d8781",
  faint: "#a9b0ab",
  line: "#e6e2d8",
  brass: "#966b22",
  brassSoft: "#e0b963",
  pine: "#10331f",
  paper: "#fbfaf7",
  page: "#f1efe8",
};

function rows(fields: Field[]): string {
  return fields
    .map((f) => {
      const raw = (f.value ?? "").trim();
      if (!raw && f.empty === null) return "";
      const shown = raw || f.empty || "";
      if (!shown) return "";
      let cell = esc(shown).replace(/\n/g, "<br>");
      if (raw && f.tel) cell = `<a href="${telHref(raw)}" style="color:${C.brass};text-decoration:none;font-weight:700">${cell}</a>`;
      else if (raw && f.mailto) cell = `<a href="mailto:${esc(raw)}" style="color:${C.brass};text-decoration:none;font-weight:700">${cell}</a>`;
      const color = raw ? C.body : C.muted;
      const italic = raw ? "" : "font-style:italic;";
      return `<tr>
        <td width="128" style="width:128px;padding:9px 18px 9px 0;color:${C.muted};font:600 11px/1.5 ${SANS};letter-spacing:.08em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${esc(f.label)}</td>
        <td style="padding:9px 0;color:${color};${italic}font:15px/1.55 ${SANS};vertical-align:top">${cell}</td>
      </tr>`;
    })
    .join("");
}

/* Bulletproof buttons: the <td> carries the colour via bgcolor (an attribute
   no client strips) and the <a> is display:block so the whole cell is the tap
   target. A styled inline-block <a> looks right but does nothing on a phone. */
function button(href: string, label: string, solid: boolean): string {
  const bg = solid ? C.pine : C.paper;
  const fg = solid ? "#ffffff" : C.pine;
  const border = solid ? C.pine : C.brass;
  return `<td bgcolor="${bg}" style="border-radius:2px;background-color:${bg};border:1px solid ${border}">
      <a href="${href}" style="display:block;padding:14px 22px;color:${fg};font:700 13px/1 ${SANS};letter-spacing:.08em;text-transform:uppercase;text-decoration:none">${esc(label)}</a>
    </td>`;
}

type Rendered = { names: string; email: string; phone: string; sections: Section[]; preheader: string };

function leadHtml(o: Rendered): string {
  const body = o.sections
    .map((s) => {
      const r = rows(s.fields);
      if (!r.trim()) return "";
      return `<tr><td style="padding:22px 30px 0">
        <p style="margin:0 0 4px;color:${C.brass};font:700 11px/1 ${SANS};letter-spacing:.16em;text-transform:uppercase">${esc(s.title)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">${r}</table>
      </td></tr>`;
    })
    .join("");

  const buttons = [
    o.email ? button(`mailto:${esc(o.email)}?subject=${encodeURIComponent("Your private tour of The GlenLary Estate")}`, "Reply by email", true) : "",
    o.phone ? `<td width="10" style="width:10px;font-size:0">&nbsp;</td>${button(telHref(o.phone), `Call ${o.phone}`, false)}` : "",
  ].join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${C.page}">
  <tr><td align="center" style="padding:28px 14px">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${C.line}">

      <tr><td bgcolor="${C.pine}" style="background:${C.pine};padding:22px 30px;text-align:center">
        <p style="margin:0;color:#fbfaf7;font:600 16px/1.2 ${SERIF};letter-spacing:.24em;text-transform:uppercase">The GlenLary Estate</p>
        <p style="margin:7px 0 0;color:${C.brassSoft};font:600 10px/1.4 ${SANS};letter-spacing:.24em;text-transform:uppercase">New private tour request</p>
      </td></tr>
      <tr><td style="height:3px;background:${C.brassSoft};background-color:${C.brassSoft};font-size:0;line-height:0">&nbsp;</td></tr>

      <tr><td style="padding:28px 30px 0">
        <p style="margin:0;color:${C.ink};font:italic 400 28px/1.2 ${SERIF}">${esc(o.names || "New inquiry")}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0"><tr>${buttons}</tr></table>
      </td></tr>

      ${body}

      <tr><td style="padding:24px 30px 26px">
        <div style="border-top:1px solid ${C.line};padding-top:16px">
          <p style="margin:0;color:${C.muted};font:13px/1.6 ${SANS}">
            Hit Reply to answer them directly. Their email is already set as the reply address.
          </p>
          <p style="margin:10px 0 0;color:${C.faint};font:11px/1.5 ${SANS}">
            Sent by the tour form on eventsatglenlary.com &middot; built by Epic Dev Solutions
          </p>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function leadText(o: Rendered): string {
  const out: string[] = ["NEW PRIVATE TOUR REQUEST", "", o.names, o.email];
  if (o.phone) out.push(o.phone);
  out.push("");
  for (const s of o.sections) {
    const lines = s.fields
      .map((f) => {
        const raw = (f.value ?? "").trim();
        if (!raw && f.empty === null) return "";
        const shown = raw || f.empty || "";
        return shown ? `  ${f.label}: ${shown.replace(/\n/g, " ")}` : "";
      })
      .filter(Boolean);
    if (lines.length) out.push(s.title.toUpperCase(), ...lines, "");
  }
  return out.join("\n");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Turn a submission into the finished email. */
export function buildLeadEmail(lead: TourLead): {
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name?: string };
} {
  const email = lead.email.trim();
  const phone = lead.phone ? prettyPhone(lead.phone) : "";
  const type = (lead.type || "").trim();
  const when = (lead.when || "").trim();
  const guests = (lead.guests || "").trim();

  const submitted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  const sections: Section[] = [
    {
      title: "How to reach them",
      fields: [
        { label: "Names", value: lead.names },
        { label: "Email", value: email, mailto: true },
        { label: "Phone", value: phone, empty: "Not provided", tel: true },
      ],
    },
    {
      title: "Their celebration",
      fields: [
        { label: "Celebration", value: type, empty: "Not selected" },
        { label: "Date in mind", value: when, empty: "Not provided" },
        { label: "Guests", value: guests, empty: "Not provided" },
      ],
    },
    {
      title: "About their day",
      fields: [{ label: "They wrote", value: lead.vision, empty: "Nothing added" }],
    },
    { title: "Request details", fields: [{ label: "Submitted", value: `${submitted} ET` }] },
  ];

  const gist = [type, when, guests && `${guests} guests`].filter(Boolean).join(" · ");
  const rendered: Rendered = {
    names: lead.names,
    email,
    phone,
    sections,
    preheader: gist || "Private tour request",
  };

  return {
    subject: `Tour request: ${lead.names}${gist ? ` (${gist})` : ""}`,
    html: leadHtml(rendered),
    text: leadText(rendered),
    ...(EMAIL_RE.test(email) ? { replyTo: { email, name: lead.names } } : {}),
  };
}

/** Send one tour request. No-ops cleanly when the key is unset. */
export async function sendLead(lead: TourLead): Promise<{
  ok: boolean;
  skipped?: boolean;
  status?: number;
  error?: string;
  /* Brevo's id for the accepted message: the only thing that separates "sent
     and the inbox ate it" from "never sent" when debugging. */
  messageId?: string;
}> {
  const key = brevoKey();
  if (!key) {
    console.warn("[glenlary] BREVO_API_KEY missing, skipping send.");
    return { ok: false, skipped: true };
  }
  const built = buildLeadEmail(lead);
  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: FROM_EMAIL, name: FROM_NAME },
        to: TO_EMAIL.split(",").map((e) => e.trim()).filter(Boolean).map((email) => ({ email })),
        ...(built.replyTo ? { replyTo: built.replyTo } : {}),
        subject: built.subject,
        htmlContent: built.html,
        textContent: built.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[glenlary] Brevo send failed:", res.status, detail);
      return { ok: false, status: res.status, error: detail.slice(0, 300) };
    }
    const json = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { ok: true, messageId: json.messageId };
  } catch (err) {
    console.error("[glenlary] send error:", err);
    return { ok: false, error: String(err) };
  }
}
