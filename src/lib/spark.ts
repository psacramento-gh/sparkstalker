const TETHER_DOMAIN = "tether.me";
const LNURL_PREFIX = "https://tether.me/.well-known/lnurlp/";

export type LnurlPayMetadata = {
  callback?: string;
};

type FetchLnurlOptions = {
  acceptLanguage?: string | null;
  userAgent?: string | null;
};

export function normalizeTetherInput(input: string): string | null {
  const normalizedInput = input.trim().toLowerCase();

  if (!normalizedInput) {
    return null;
  }

  if (!normalizedInput.includes("@")) {
    return /^[a-z0-9._-]+$/.test(normalizedInput) ? normalizedInput : null;
  }

  const [username, domain, ...rest] = normalizedInput.split("@");

  if (rest.length > 0 || !username || domain !== TETHER_DOMAIN) {
    return null;
  }

  return /^[a-z0-9._-]+$/.test(username) ? username : null;
}

export async function fetchLnurlPayMetadata(
  username: string,
  options: FetchLnurlOptions = {},
): Promise<LnurlPayMetadata> {
  let response: Response;
  const userAgent = options.userAgent?.trim();
  const acceptLanguage = options.acceptLanguage?.trim();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": userAgent || "SparkStalker/1.0 (+https://sparkstalker.vercel.app)",
  };

  if (acceptLanguage) {
    headers["Accept-Language"] = acceptLanguage;
  }

  try {
    response = await fetch(`${LNURL_PREFIX}${encodeURIComponent(username)}`, {
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error("UPSTREAM_ERROR");
  }

  if (response.status === 404) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("UPSTREAM_ERROR");
  }

  const data = (await response.json()) as LnurlPayMetadata;

  if (!data || typeof data !== "object") {
    throw new Error("INVALID_RESPONSE");
  }

  return data;
}

export function extractCallbackIdentifier(callback: string): string | null {
  try {
    const callbackUrl = new URL(callback);

    if (callbackUrl.protocol !== "https:" || callbackUrl.hostname !== TETHER_DOMAIN) {
      return null;
    }

    const segments = callbackUrl.pathname.split("/").filter(Boolean);

    if (segments.length !== 4 || segments[0] !== "api" || segments[1] !== "lnurl" || segments[2] !== "payreq") {
      return null;
    }

    return segments[3] ?? null;
  } catch {
    return null;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return bytes;
}

function bytesToWords(data: Uint8Array): number[] {
  const words: number[] = [];
  let accumulator = 0;
  let bits = 0;

  for (const byte of data) {
    accumulator = (accumulator << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      words.push((accumulator >> bits) & 31);
    }
  }

  if (bits > 0) {
    words.push((accumulator << (5 - bits)) & 31);
  }

  return words;
}

function polymod(values: number[]): number {
  const generators = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;

  for (const value of values) {
    const top = checksum >> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;

    for (let index = 0; index < generators.length; index += 1) {
      if ((top >> index) & 1) {
        checksum ^= generators[index];
      }
    }
  }

  return checksum;
}

function hrpExpand(hrp: string): number[] {
  const expanded: number[] = [];

  for (const char of hrp) {
    expanded.push(char.charCodeAt(0) >> 5);
  }

  expanded.push(0);

  for (const char of hrp) {
    expanded.push(char.charCodeAt(0) & 31);
  }

  return expanded;
}

function createChecksum(hrp: string, data: number[]): number[] {
  const values = [...hrpExpand(hrp), ...data, 0, 0, 0, 0, 0, 0];
  const polymodValue = polymod(values) ^ 0x2bc830a3;
  const checksum: number[] = [];

  for (let index = 0; index < 6; index += 1) {
    checksum.push((polymodValue >> (5 * (5 - index))) & 31);
  }

  return checksum;
}

function bech32mEncode(hrp: string, data: Uint8Array): string {
  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  const words = bytesToWords(data);
  const checksum = createChecksum(hrp, words);
  const encoded = [...words, ...checksum].map((value) => charset[value]).join("");

  return `${hrp}1${encoded}`;
}

function isValidCompressedSecp256k1PublicKey(pubkeyBytes: Uint8Array): boolean {
  if (pubkeyBytes.length !== 33) {
    return false;
  }

  const prefix = pubkeyBytes[0];

  if (prefix !== 0x02 && prefix !== 0x03) {
    return false;
  }

  const xHex = Array.from(pubkeyBytes.slice(1), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const x = BigInt(`0x${xHex}`);
  const p = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
  const rhs = (x ** BigInt(3) + BigInt(7)) % p;
  const y = modPow(rhs, (p + BigInt(1)) / BigInt(4), p);

  if ((y * y) % p !== rhs) {
    return false;
  }

  const shouldBeOdd = prefix === 0x03;
  const isOdd = (y & BigInt(1)) === BigInt(1);

  return shouldBeOdd === isOdd;
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = BigInt(1);
  let currentBase = base % modulus;
  let currentExponent = exponent;

  while (currentExponent > BigInt(0)) {
    if (currentExponent & BigInt(1)) {
      result = (result * currentBase) % modulus;
    }

    currentBase = (currentBase * currentBase) % modulus;
    currentExponent >>= BigInt(1);
  }

  return result;
}

export function isValidCompressedPubkeyHex(identifier: string): boolean {
  if (!/^(02|03)[a-f0-9]{64}$/.test(identifier)) {
    return false;
  }

  return isValidCompressedSecp256k1PublicKey(hexToBytes(identifier));
}

export function deriveSparkAddressFromIdentifier(identifier: string): string {
  const pubkeyBytes = hexToBytes(identifier);
  const payload = new Uint8Array(2 + pubkeyBytes.length);

  payload[0] = 0x0a;
  payload[1] = 0x21;
  payload.set(pubkeyBytes, 2);

  return bech32mEncode("spark", payload);
}

export function buildSparkScanUrl(sparkAddress: string): string {
  return `https://sparkscan.io/address/${sparkAddress}`;
}
