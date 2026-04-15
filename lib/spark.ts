import { encodeSparkAddress } from "@buildonspark/spark-sdk";
import { ResolveError } from "./errors";

export function deriveSparkAddress(identityPublicKeyHex: string): string {
  try {
    return encodeSparkAddress({
      network: "MAINNET",
      identityPublicKey: identityPublicKeyHex,
    });
  } catch {
    throw new ResolveError("SPARK_DERIVATION_FAILED");
  }
}
