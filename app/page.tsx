"use client";

import { useState } from "react";
import { resolveTetherUsername } from "@/lib/resolve";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  async function onResolve() {
    setError(null);
    setLink(null);
    setLoading(true);
    try {
      const result = await resolveTetherUsername(value);
      if (result.ok) {
        setLink(result.sparkScanUrl);
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <p className="text-sm text-muted-foreground">
          Resolve a public tether.me username to a SparkScan wallet page.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="mat99@tether.me"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onResolve();
          }}
          className="flex-1"
        />
        <Button
          type="button"
          size="lg"
          disabled={loading}
          onClick={() => void onResolve()}
          className="shrink-0 sm:w-auto"
        >
          {loading ? "…" : "Resolve"}
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
