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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          SparkStalker
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
          className="min-h-10 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void onResolve()}
          className="min-h-10 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "…" : "Resolve"}
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {link ? (
        <p className="text-sm">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400"
          >
            Open in SparkScan
          </a>
        </p>
      ) : null}
    </main>
  );
}
