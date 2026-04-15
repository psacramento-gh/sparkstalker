import { ResolveError } from "./errors";

const BASE = "https://sparkscan.io/address/";

/**
 * SparkScan mainnet address pages use path `/address/<sparkAddress>?network=mainnet` (verified HTTP 200).
 */
export function buildSparkScanUrl(sparkAddress: string): string {
  try {
    const u = new URL(BASE + encodeURIComponent(sparkAddress));
    u.searchParams.set("network", "mainnet");
    if (!u.href.startsWith(BASE)) {
      throw new Error("unexpected");
    }
    return u.href;
  } catch {
    throw new ResolveError("SPARKSCAN_BUILD_FAILED");
  }
}
