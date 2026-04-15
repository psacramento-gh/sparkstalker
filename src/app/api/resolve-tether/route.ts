import {
  buildSparkScanUrl,
  deriveSparkAddressFromIdentifier,
  extractCallbackIdentifier,
  fetchLnurlPayMetadata,
  isValidCompressedPubkeyHex,
  normalizeTetherInput,
} from "@/lib/spark";

const errors = {
  invalid: "Only tether.me usernames are supported",
  notFound: "User not found",
  notResolvable: "Not resolvable",
  upstream: "Unable to reach tether.me right now",
  generic: "Something went wrong",
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { username?: string };
    const username = normalizeTetherInput(body.username ?? "");

    if (!username) {
      return Response.json({ error: errors.invalid }, { status: 400 });
    }

    const lnurlMetadata = await fetchLnurlPayMetadata(username, {
      userAgent: request.headers.get("user-agent"),
      acceptLanguage: request.headers.get("accept-language"),
    });
    const identifier = extractCallbackIdentifier(lnurlMetadata.callback ?? "");

    if (!identifier || !isValidCompressedPubkeyHex(identifier)) {
      return Response.json({ error: errors.notResolvable }, { status: 422 });
    }

    const sparkAddress = deriveSparkAddressFromIdentifier(identifier);
    const sparkScanUrl = buildSparkScanUrl(sparkAddress);

    return Response.json({ url: sparkScanUrl });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return Response.json({ error: errors.notFound }, { status: 404 });
    }

    if (error instanceof Error && error.message === "UPSTREAM_ERROR") {
      return Response.json({ error: errors.upstream }, { status: 502 });
    }

    return Response.json({ error: errors.generic }, { status: 500 });
  }
}
