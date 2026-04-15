# SparkStalker

Small web app that turns a **tether.me** username into a **Spark mainnet address** and opens its history on [SparkScan](https://sparkscan.io).

Tagline in the UI: *See every transaction linked to a tether.me username.*

## How it works

1. You enter a username (`alice` or `alice@tether.me`). Input is normalized and validated on the client.
2. The app requests LNURL-pay metadata from tether.me through a **same-origin relay** (`GET /api/lnurlp?user=…`) so the browser is not blocked by CORS. The relay runs on the **Edge** runtime, forwards the upstream response, and applies a strict username pattern plus a 15s timeout.
3. From the LNURL metadata, the app reads the **callback** URL, extracts the **identity public key**, encodes it as a Spark address with [`@buildonspark/spark-sdk`](https://www.npmjs.com/package/@buildonspark/spark-sdk) (mainnet), and builds a SparkScan address URL.

No cookies, server-side persistence, or analytics are implemented in this relay path.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), [React](https://react.dev) 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4, UI primitives (Radix / Base UI–style components in `components/ui/`)
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark
- [Vitest](https://vitest.dev) for unit tests under `lib/**/*.test.ts`

`next.config.ts` transpiles `@buildonspark/spark-sdk`.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (or another client compatible with `package.json`)

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Next.js dev server       |
| `npm run build`| Production build         |
| `npm run start`| Serve production build   |
| `npm run lint` | ESLint (Next.js config)  |
| `npm run test` | Vitest (`lib/**/*.test.ts`) |

## Deployment

Deploy like any Next.js app (for example [Vercel](https://vercel.com)). The LNURL relay uses `fetch` to `https://tether.me/` from the deployment region; no extra environment variables are required for that flow.

## Links

- Author: [pSacramento](https://www.psacramento.com/)
- [GitHub repository](https://github.com/psacramento-gh/sparkstalker)
