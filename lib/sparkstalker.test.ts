import { describe, expect, it } from "vitest";
import { extractIdentifierFromCallback } from "./callback";
import { mapLnurlRelayFailure, parseLnurlJson } from "./errors";
import { validateIdentifier } from "./identifier";
import { normalizeInput, validateInput } from "./input";
import { deriveSparkAddress } from "./spark";
import { buildSparkScanUrl } from "./sparkscan";

describe("normalizeInput / validateInput", () => {
  it("accepts bare username", () => {
    expect(validateInput(normalizeInput("  Mat99  "))).toEqual({ ok: true, username: "mat99" });
  });

  it("accepts email form and lowercases", () => {
    expect(validateInput(normalizeInput("Mat99@Tether.ME"))).toEqual({ ok: true, username: "mat99" });
  });

  it("rejects unsupported domain before local-part charset issues", () => {
    const r = validateInput(normalizeInput("x@example.com"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("UNSUPPORTED_DOMAIN");
  });

  it("rejects invalid local part", () => {
    const r = validateInput(normalizeInput("-bad@tether.me"));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("INVALID_USERNAME_FORMAT");
  });

  it("rejects empty", () => {
    const r = validateInput(normalizeInput("   "));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("EMPTY_INPUT");
  });
});

describe("LNURL error mapping", () => {
  it("maps 404 to user not found", () => {
    const e = mapLnurlRelayFailure(404, "{}");
    expect(e.code).toBe("USER_NOT_FOUND");
  });

  it("maps tether UMA JSON on 404 body", () => {
    const e = mapLnurlRelayFailure(
      400,
      JSON.stringify({ statusCode: 404, message: "ERR_UMA_USER_NOT_FOUND" }),
    );
    expect(e.code).toBe("USER_NOT_FOUND");
  });

  it("parses LUD-06 ERROR as not found when reason says not found", () => {
    const p = parseLnurlJson(JSON.stringify({ status: "ERROR", reason: "User not found" }));
    expect(p.ok).toBe(false);
    if (!p.ok) expect(p.error.code).toBe("USER_NOT_FOUND");
  });
});

describe("callback + identifier + spark + sparkscan (golden mat99)", () => {
  const callback =
    "https://tether.me/api/lnurl/payreq/0391b2fbecae8f2d66063592faa94c888f1666feda7a2f23b133d0702960a889c3";

  it("extracts identifier", () => {
    expect(extractIdentifierFromCallback(callback)).toBe(
      "0391b2fbecae8f2d66063592faa94c888f1666feda7a2f23b133d0702960a889c3",
    );
  });

  it("validates identifier hex", () => {
    expect(validateIdentifier("0391b2fbecae8f2d66063592faa94c888f1666feda7a2f23b133d0702960a889c3")).toBe(
      "0391b2fbecae8f2d66063592faa94c888f1666feda7a2f23b133d0702960a889c3",
    );
  });

  it("derives Spark address matching SDK / SparkScan", () => {
    const addr = deriveSparkAddress(
      "0391b2fbecae8f2d66063592faa94c888f1666feda7a2f23b133d0702960a889c3",
    );
    expect(addr).toBe("spark1pgss8ydjl0k2aredvcrrtyh649xg3rckvmld5730ywcn85rs99s23zwrkudvj4");
  });

  it("builds SparkScan mainnet URL", () => {
    const addr = "spark1pgss8ydjl0k2aredvcrrtyh649xg3rckvmld5730ywcn85rs99s23zwrkudvj4";
    expect(buildSparkScanUrl(addr)).toBe(
      "https://sparkscan.io/address/spark1pgss8ydjl0k2aredvcrrtyh649xg3rckvmld5730ywcn85rs99s23zwrkudvj4?network=mainnet",
    );
  });
});
