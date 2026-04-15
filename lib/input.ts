/**
 * Input rules (username / email form) and error precedence:
 * 1. Trim; if empty → EMPTY_INPUT
 * 2. If `@` present: split once on last `@` for local@domain? Standard: single @ — multiple `@` → INVALID_USERNAME_FORMAT
 *    - Domain compared case-insensitively to `tether.me` only → else UNSUPPORTED_DOMAIN
 *    - Local part empty → INVALID_USERNAME_FORMAT
 * 3. If no `@`: entire string is local username (must not contain `@`)
 * 4. Local part charset: start with alphanumeric; rest alnum, `.`, `_`, `-`; length 1–64 (conservative LNURL handle)
 *    - Normalize hex identifier separately; here usernames only lowercase for comparison, output lowercased local part
 */

const TETHER_DOMAIN = "tether.me";

/** 1–64 chars; must start and end with alphanumeric (internal `.` `_` `-` allowed). */
const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/;

export type NormalizeResult =
  | { ok: true; username: string }
  | { ok: false; code: import("./errors").ResolveErrorCode };

/** Trim; do not lowercase identifier hex — only username normalization. */
export function normalizeInput(raw: string): string {
  return raw.trim();
}

export function validateInput(normalized: string): NormalizeResult {
  if (!normalized) {
    return { ok: false, code: "EMPTY_INPUT" };
  }

  if (normalized.includes("@")) {
    const parts = normalized.split("@");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { ok: false, code: "INVALID_USERNAME_FORMAT" };
    }
    const [local, domain] = parts;
    if (local.includes("@")) {
      return { ok: false, code: "INVALID_USERNAME_FORMAT" };
    }
    if (domain.toLowerCase() !== TETHER_DOMAIN) {
      return { ok: false, code: "UNSUPPORTED_DOMAIN" };
    }
    const user = local.toLowerCase();
    if (user.length > 64 || !USERNAME_RE.test(user)) {
      return { ok: false, code: "INVALID_USERNAME_FORMAT" };
    }
    return { ok: true, username: user };
  }

  const user = normalized.toLowerCase();
  if (user.length > 64 || !USERNAME_RE.test(user)) {
    return { ok: false, code: "INVALID_USERNAME_FORMAT" };
  }
  return { ok: true, username: user };
}
