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
  const [link, setLink] = useState<string | null>(null);
  /** `normalizeInput` snapshot for the last completed query; button stays disabled until `value` normalizes to something else. */
  const [lastQueriedNormalized, setLastQueriedNormalized] = useState<string | null>(
    null,
  );

  const submitDisabled =
    loading ||
    (lastQueriedNormalized !== null &&
      normalizeInput(value) === lastQueriedNormalized);

  async function onResolve() {
    const queriedValue = value;
    setError(null);
    setLink(null);
    setLoading(true);
    try {
      const result = await resolveTetherUsername(queriedValue);
      if (result.ok) {
        setLink(result.sparkScanUrl);
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
          See every transaction linked to a tether.me username.
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
          {loading ? "…" : "Check transactions"}
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {link ? (
        <p className="text-sm">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground"
          >
            Open in SparkScan
          </a>
        </p>
      ) : null}
    </>
  );
}
