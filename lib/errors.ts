/**
 * Maps tether.me / LNURL / local validation outcomes to PRD copy.
 * @see lock-lnurl-errors in implementation plan
 */
export type ResolveErrorCode =
  | "EMPTY_INPUT"
  | "UNSUPPORTED_DOMAIN"
  | "INVALID_USERNAME_FORMAT"
  | "USER_NOT_FOUND"
  | "LOOKUP_FAILED"
  | "INVALID_LNURL_RESPONSE"
  | "MISSING_CALLBACK"
  | "INVALID_IDENTIFIER"
  | "SPARK_DERIVATION_FAILED"
  | "SPARKSCAN_BUILD_FAILED"
  | "UNKNOWN";

export const ERROR_MESSAGES: Record<ResolveErrorCode, string> = {
  EMPTY_INPUT: "Enter a tether.me username",
  UNSUPPORTED_DOMAIN: "Only tether.me usernames are supported",
  INVALID_USERNAME_FORMAT: "That username format is not valid",
  USER_NOT_FOUND: "User not found",
  LOOKUP_FAILED: "Could not reach tether.me",
  INVALID_LNURL_RESPONSE: "The tether.me response was incomplete",
  MISSING_CALLBACK: "Could not extract a payment callback",
  INVALID_IDENTIFIER: "The wallet identifier was not usable",
  SPARK_DERIVATION_FAILED: "Could not derive the Spark address",
  SPARKSCAN_BUILD_FAILED: "Could not build the SparkScan link",
  UNKNOWN: "Something went wrong",
};

export class ResolveError extends Error {
  readonly code: ResolveErrorCode;

  constructor(code: ResolveErrorCode, message?: string) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = "ResolveError";
    this.code = code;
  }
}

/** Map relay HTTP failures and tether responses to ResolveError. */
export function mapLnurlRelayFailure(
  status: number,
  bodyText: string,
): ResolveError {
  if (status === 404) {
    return new ResolveError("USER_NOT_FOUND");
  }
  if (status >= 500 || status === 429) {
    return new ResolveError("LOOKUP_FAILED");
  }
  if (status === 0 || status >= 400) {
    // Try parse JSON for UMA errors
    try {
      const j = JSON.parse(bodyText) as { statusCode?: number; message?: string };
      if (j.statusCode === 404 || String(j.message ?? "").includes("USER_NOT_FOUND")) {
        return new ResolveError("USER_NOT_FOUND");
      }
    } catch {
      /* ignore */
    }
    return new ResolveError("LOOKUP_FAILED");
  }
  return new ResolveError("UNKNOWN");
}

/** Parse JSON body; detect LUD-06 style ERROR. */
export function parseLnurlJson(
  bodyText: string,
): { ok: true; data: unknown } | { ok: false; error: ResolveError } {
  let data: unknown;
  try {
    data = JSON.parse(bodyText) as unknown;
  } catch {
    return { ok: false, error: new ResolveError("INVALID_LNURL_RESPONSE") };
  }
  if (!data || typeof data !== "object") {
    return { ok: false, error: new ResolveError("INVALID_LNURL_RESPONSE") };
  }
  const rec = data as Record<string, unknown>;
  if (rec.status === "ERROR") {
    const reason = String(rec.reason ?? "").toLowerCase();
    if (reason.includes("not found") || reason.includes("unknown")) {
      return { ok: false, error: new ResolveError("USER_NOT_FOUND") };
    }
    return { ok: false, error: new ResolveError("INVALID_LNURL_RESPONSE") };
  }
  return { ok: true, data };
}
