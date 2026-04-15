import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const UPSTREAM_BASE = "https://tether.me/.well-known/lnurlp/";
const TIMEOUT_MS = 15_000;

/** Same-origin relay only; prevents abuse with a tight username pattern (matches client validation). */
const RELAY_USER_RE = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

/**
 * LNURL relay (same-origin only)
 *
 * - **Method:** `GET` only
 * - **Query:** `user` — normalized `tether.me` username (`mat99`, already lowercased on client)
 * - **Upstream:** `GET https://tether.me/.well-known/lnurlp/{user}` (URL-encoded path segment)
 * - **Response:** upstream **status** and **body**; `Content-Type` preserved when present
 * - **Timeout:** 15s → `504` with plain text (client maps to “Could not reach tether.me”)
 * - **No** cookies, persistence, analytics, or request logging
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = req.nextUrl.searchParams.get("user");
  if (!user || user.length > 64 || !RELAY_USER_RE.test(user)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const upstreamUrl = `${UPSTREAM_BASE}${encodeURIComponent(user)}`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: ac.signal,
      cache: "no-store",
    });
  } catch {
    clearTimeout(t);
    return new NextResponse("Gateway Timeout", { status: 504 });
  } finally {
    clearTimeout(t);
  }

  const body = await upstream.text();
  const ct = upstream.headers.get("content-type");
  return new NextResponse(body, {
    status: upstream.status,
    headers: ct ? { "content-type": ct } : undefined,
  });
}
