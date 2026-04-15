"use client";

import { type FormEvent, useMemo, useState } from "react";

import Link from "next/link";

import { LoaderCircle, TriangleAlert } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  buildSparkScanUrl,
  deriveSparkAddressFromIdentifier,
  extractCallbackIdentifier,
  fetchLnurlPayMetadata,
  isValidCompressedPubkeyHex,
  normalizeTetherInput,
} from "@/lib/spark";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; url: string };

const errorMessages = {
  empty: "Enter a tether.me username",
  invalidDomain: "Only tether.me usernames are supported",
  notFound: "User not found",
  notResolvable: "Not resolvable",
  generic: "Something went wrong",
};

export function SparkStalkerTool() {
  const [inputValue, setInputValue] = useState("");
  const [lookupState, setLookupState] = useState<LookupState>({ status: "idle" });

  const hasInput = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasInput) {
      setLookupState({ status: "error", message: errorMessages.empty });
      return;
    }

    const username = normalizeTetherInput(inputValue);

    if (!username) {
      setLookupState({ status: "error", message: errorMessages.invalidDomain });
      return;
    }

    setLookupState({ status: "loading" });

    try {
      const lnurlMetadata = await fetchLnurlPayMetadata(username);
      const identifier = extractCallbackIdentifier(lnurlMetadata.callback ?? "");

      if (!identifier || !isValidCompressedPubkeyHex(identifier)) {
        setLookupState({ status: "error", message: errorMessages.notResolvable });
        return;
      }

      const sparkAddress = deriveSparkAddressFromIdentifier(identifier);
      const explorerUrl = buildSparkScanUrl(sparkAddress);

      setLookupState({ status: "success", url: explorerUrl });
    } catch (error) {
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        setLookupState({ status: "error", message: errorMessages.notFound });
      } else if (error instanceof Error && error.message === "UPSTREAM_ERROR") {
        setLookupState({ status: "error", message: "Unable to reach tether.me right now" });
      } else {
        setLookupState({ status: "error", message: errorMessages.generic });
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:py-14">
      <section className="space-y-4">
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Privacy audit proof of concept
        </p>
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">SparkStalker</h1>
        <p className="text-lg text-muted-foreground">From tether.me username to Spark explorer</p>
        <p className="text-foreground text-sm">Public payment metadata can reveal more than expected.</p>
      </section>

      <Card className="mt-8 border shadow-sm">
        <CardHeader>
          <CardTitle>Resolve public tether.me metadata</CardTitle>
          <CardDescription>
            Resolve a public tether.me username into its corresponding Spark explorer page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="space-y-2" htmlFor="tether-username">
              <span className="font-medium text-sm">tether.me username</span>
              <Input
                autoComplete="off"
                className="h-11 text-base"
                id="tether-username"
                inputMode="email"
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="psacramento1@tether.me"
                value={inputValue}
              />
            </label>
            <Button
              className="h-11 w-full sm:w-auto"
              disabled={!hasInput || lookupState.status === "loading"}
              type="submit"
            >
              {lookupState.status === "loading" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Resolving
                </>
              ) : (
                "Resolve"
              )}
            </Button>
          </form>

          <div className="mt-5 min-h-24 rounded-lg border bg-muted/20 p-4">
            {lookupState.status === "success" ? (
              <div className="space-y-2">
                <Button asChild className="h-10" size="lg">
                  <a href={lookupState.url} rel="noreferrer" target="_blank">
                    Open in SparkScan
                  </a>
                </Button>
                <p className="text-muted-foreground text-sm">Resolved from public tether.me metadata.</p>
              </div>
            ) : null}

            {lookupState.status === "error" ? (
              <Alert variant="destructive">
                <TriangleAlert className="size-4" />
                <AlertTitle>{lookupState.message}</AlertTitle>
              </Alert>
            ) : null}

            {lookupState.status === "idle" || lookupState.status === "loading" ? (
              <p className="text-muted-foreground text-sm">Enter a username and resolve in one step.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <section className="mt-6 space-y-4">
        <Separator />
        <p className="text-muted-foreground text-sm">
          SparkStalker shows how a public tether.me lookup can lead to a public Spark explorer page.
        </p>
        <Link
          className="inline-flex font-medium text-primary text-sm underline-offset-4 hover:underline"
          href="/how-it-works"
        >
          Read how it works
        </Link>
      </section>

      <footer className="mt-auto pt-10 text-muted-foreground text-sm">No tracking. No storage.</footer>
    </main>
  );
}
