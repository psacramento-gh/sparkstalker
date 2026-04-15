import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:py-14">
      <div className="space-y-3">
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.2em]">How it works</p>
        <h1 className="font-semibold text-3xl tracking-tight">Public metadata, mapped</h1>
        <p className="text-muted-foreground">
          SparkStalker checks whether a public tether.me username can be linked to a public Spark explorer page.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>What SparkStalker does</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-sm">
            <p>
              The app takes a tether.me username, fetches its public LNURL pay metadata, and checks whether the callback
              value exposes a Spark identity key.
            </p>
            <p>
              If it does, SparkStalker derives a Spark mainnet address client-side and opens the corresponding SparkScan
              page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How the mapping works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-sm">
            <p>1. Normalize input to a tether.me username.</p>
            <p>2. Fetch `/.well-known/lnurlp/&lt;username&gt;` from tether.me.</p>
            <p>3. Read the callback URL and extract its final path segment.</p>
            <p>4. Validate that segment as a compressed secp256k1 public key.</p>
            <p>5. Encode it into a Spark mainnet Bech32m address.</p>
            <p>6. Build and show the SparkScan explorer link.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why this matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-sm">
            <p>
              A payment identifier that looks simple can still expose linkable public metadata. SparkStalker
              demonstrates that linkage directly, without needing wallet access or private data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limits and privacy posture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground text-sm">
            <p>Only tether.me usernames are supported, and only public data is used.</p>
            <p>Derivation is mainnet-only and runs fully client-side in your browser.</p>
            <p>No login, no backend, no cookies, no analytics, and no local or session storage.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link className="font-medium text-primary text-sm underline-offset-4 hover:underline" href="/">
          Back to resolver
        </Link>
      </div>
    </main>
  );
}
