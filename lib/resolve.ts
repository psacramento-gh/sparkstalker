import { extractCallbackUrl, extractIdentifierFromCallback } from "./callback";
import { ERROR_MESSAGES, ResolveError, type ResolveErrorCode } from "./errors";
import { fetchLnurlMetadata } from "./lnurl";
import { validateIdentifier } from "./identifier";
import { normalizeInput, validateInput } from "./input";
import { deriveSparkAddress } from "./spark";
import { buildSparkScanUrl } from "./sparkscan";

export type ResolveSuccess = { ok: true; sparkScanUrl: string; sparkAddress: string };
export type ResolveFailure = { ok: false; message: string; code: ResolveErrorCode };

export async function resolveTetherUsername(rawInput: string): Promise<ResolveSuccess | ResolveFailure> {
  const normalized = normalizeInput(rawInput);
  const validated = validateInput(normalized);
  if (!validated.ok) {
    return { ok: false, code: validated.code, message: ERROR_MESSAGES[validated.code] };
  }

  try {
    const meta = await fetchLnurlMetadata(validated.username);
    const callback = extractCallbackUrl(meta);
    const idRaw = extractIdentifierFromCallback(callback);
    const idHex = validateIdentifier(idRaw);
    const sparkAddress = deriveSparkAddress(idHex);
    const sparkScanUrl = buildSparkScanUrl(sparkAddress);
    return { ok: true, sparkScanUrl, sparkAddress };
  } catch (e: unknown) {
    if (e instanceof ResolveError) {
      return { ok: false, code: e.code, message: ERROR_MESSAGES[e.code] };
    }
    return { ok: false, code: "UNKNOWN", message: ERROR_MESSAGES.UNKNOWN };
  }
}
