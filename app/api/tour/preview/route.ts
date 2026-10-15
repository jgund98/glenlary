import { buildLeadEmail } from "@/lib/lead-email";

/*
 * Preview of the tour-request email, so the template can be checked in a
 * browser without sending anything.
 *
 *   LEAD_PREVIEW=1 npm start  ->  http://localhost:3571/api/tour/preview
 *   ?empty=1                  ->  the sparse version (optional fields skipped)
 *
 * 404s in production unless LEAD_PREVIEW is set: it renders sample data and
 * has no reason to exist on the live site.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.LEAD_PREVIEW) {
    return new Response("Not found", { status: 404 });
  }
  const sparse = new URL(req.url).searchParams.has("empty");
  const { html } = buildLeadEmail(
    sparse
      ? { names: "Taylor", email: "taylor@example.com" }
      : {
          names: "Hannah & Wes",
          email: "hannah.wes@example.com",
          phone: "8595550147",
          type: "Wedding",
          when: "October 2027, flexible",
          guests: "150",
          vision:
            "Ceremony under the oak, dinner in the barn, and our families staying the whole weekend in the house and cabin.",
        },
  );
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
