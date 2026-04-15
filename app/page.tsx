"use client";

import { useState } from "react";
import { resolveTetherUsername } from "@/lib/resolve";

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
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          SparkStalker
        </h1>
        <p className="text-sm text-muted-foreground">
          Resolve a public tether.me username to a SparkScan wallet page.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="username"
          autoComplete="username"
          placeholder="mat99@tether.me"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onResolve();
          }}
          className="min-h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-ring placeholder:text-muted-foreground focus:border-ring focus:ring-2"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void onResolve()}
          className="min-h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "…" : "Resolve"}
        </button>
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
    </main>
  );
}
