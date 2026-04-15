# Tether.me resolution outage deep-dive

## Symptom
Users receive: `Unable to reach tether.me right now`.

## Direct trigger in code
The server route returns that exact message when `fetchLnurlPayMetadata` throws `UPSTREAM_ERROR`.

## Git history findings
- Commit `25d46a9` added server-side resolution and set a custom `User-Agent` in the upstream fetch.
- Commit `437060f` removed that `User-Agent` header while keeping server-side resolution.
- Commit `8608cfc` restored the static custom `User-Agent`.
- Despite those changes, there was still no confirmed end-to-end success from a real deployed environment.

## Root cause
The deeper issue is upstream request classification variability at `tether.me` (likely anti-bot / allowlist behavior), combined with insufficient live end-to-end validation. A static header change alone is not reliably sufficient.

## Fix applied
- Forward the *real browser* `User-Agent` and `Accept-Language` from the incoming request to the upstream tether.me request.
- Keep a safe fallback `User-Agent` when no browser header is present.
- This keeps server-side CORS-safe architecture while making upstream requests look like the real caller instead of a fixed bot-like signature.
