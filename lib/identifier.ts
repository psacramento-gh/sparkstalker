import { ResolveError } from "./errors";

const IDENT_RE = /^0[23][0-9a-fA-F]{64}$/;

export function validateIdentifier(segment: string): string {
  const hex = segment.trim();
  if (!IDENT_RE.test(hex)) {
    throw new ResolveError("INVALID_IDENTIFIER");
  }
  return hex.toLowerCase();
}
