import { ResolveError } from "./errors";

const PAYREQ_PREFIX = "/api/lnurl/payreq/";

export function extractCallbackUrl(metadata: { callback?: string }): string {
  const cb = metadata.callback;
  if (!cb || typeof cb !== "string") {
    throw new ResolveError("MISSING_CALLBACK");
  }
  return cb;
}

/**
 * Expects `https://tether.me/api/lnurl/payreq/<hex>` (hostname tether.me, path prefix fixed).
 */
export function extractIdentifierFromCallback(callbackUrl: string): string {
  let u: URL;
  try {
    u = new URL(callbackUrl);
  } catch {
    throw new ResolveError("MISSING_CALLBACK");
  }

  if (u.hostname.toLowerCase() !== "tether.me") {
    throw new ResolveError("MISSING_CALLBACK");
  }

  const path = u.pathname;
  if (!path.toLowerCase().startsWith(PAYREQ_PREFIX)) {
    throw new ResolveError("MISSING_CALLBACK");
  }

  const segment = path.slice(PAYREQ_PREFIX.length).split("/")[0] ?? "";
  if (!segment) {
    throw new ResolveError("MISSING_CALLBACK");
  }
  return segment;
}
