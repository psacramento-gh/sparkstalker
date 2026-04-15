"use client";

import { useState } from "react";
import { normalizeInput } from "@/lib/input";
import { resolveTetherUsername } from "@/lib/resolve";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolveResult, setResolveResult] = useState<{
    sparkScanUrl: string;
    sparkAddress: string;
  } | null>(null);
  /** `normalizeInput` snapshot for the last completed query; button stays disabled until `value` normalizes to something else. */
  const [lastQueriedNormalized, setLastQueriedNormalized] = useState<string | null>(
    null,
  );

  const normalizedValue = normalizeInput(value);
  const submitDisabled =
    loading ||
    !normalizedValue ||
    (lastQueriedNormalized !== null &&
      normalizedValue === lastQueriedNormalized);

  async function onResolve() {
    const queriedValue = value;
    setError(null);
    setResolveResult(null);
    setLoading(true);
    try {
      const result = await resolveTetherUsername(queriedValue);
      if (result.ok) {
        setResolveResult({
          sparkScanUrl: result.sparkScanUrl,
          sparkAddress: result.sparkAddress,
        });
      } else {
        setError(result.message);
      }
    } finally {
      setLastQueriedNormalized(normalizeInput(queriedValue));
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <p className="text-sm text-muted-foreground">
          See every transaction linked to a{" "}
          <a
            href="https://wallet.tether.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            tether.me
          </a>{" "}
          username.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="username@tether.me"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !submitDisabled) void onResolve();
          }}
          className="flex-1"
        />
        <Button
          type="button"
          size="lg"
          disabled={submitDisabled}
          onClick={() => void onResolve()}
          className="shrink-0 sm:w-auto"
        >
          Check transactions
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {resolveResult ? (
        <div className="flex flex-col gap-1.5">
          <p
            id="spark-address-label"
            className="text-xs font-medium text-muted-foreground"
          >
            Spark address
          </p>
          <a
            href={resolveResult.sparkScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby="spark-address-label"
            className="font-mono text-base font-semibold leading-snug break-all text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground"
          >
            {resolveResult.sparkAddress}
          </a>
        </div>
      ) : null}
    </>
  );
}
