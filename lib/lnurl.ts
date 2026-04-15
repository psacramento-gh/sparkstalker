import { ResolveError, mapLnurlRelayFailure, parseLnurlJson } from "./errors";

const RELAY_PATH = "/api/lnurlp";

export type LnurlPayMetadata = {
  tag?: string;
  callback?: string;
};

/**
 * Fetches LNURL-pay metadata via same-origin relay (browser CORS).
 * Relay: GET `/api/lnurlp?user=<normalized>` → tether `/.well-known/lnurlp/<user>`.
 */
export async function fetchLnurlMetadata(username: string): Promise<LnurlPayMetadata> {
  const url = `${RELAY_PATH}?user=${encodeURIComponent(username)}`;
  let res: Response;
  try {
    res = await fetch(url, { method: "GET", cache: "no-store" });
  } catch {
    throw new ResolveError("LOOKUP_FAILED");
  }

  const bodyText = await res.text();
  if (!res.ok) {
    throw mapLnurlRelayFailure(res.status, bodyText);
  }

  const parsed = parseLnurlJson(bodyText);
  if (!parsed.ok) {
    throw parsed.error;
  }

  const data = parsed.data as Record<string, unknown>;
  if (data.tag !== "payRequest") {
    throw new ResolveError("INVALID_LNURL_RESPONSE");
  }

  return {
    tag: String(data.tag),
    callback: typeof data.callback === "string" ? data.callback : undefined,
  };
}
