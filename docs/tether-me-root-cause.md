# Tether.me resolution outage root-cause analysis

## Symptom
Users receive: `Unable to reach tether.me right now`.

## Direct trigger in code
The server route returns that exact message when `fetchLnurlPayMetadata` throws `UPSTREAM_ERROR`.

## Git history findings
- Commit `25d46a9` added server-side resolution and set a custom `User-Agent` in the upstream fetch.
- Commit `437060f` removed that `User-Agent` header while keeping server-side resolution.
- After that removal, upstream requests can fail with non-200 responses, which are mapped to `UPSTREAM_ERROR` and surfaced to users as `Unable to reach tether.me right now`.

## Root cause
The regression was the removal of the explicit `User-Agent` header in the server-side call to `https://tether.me/.well-known/lnurlp/<username>`. The previous working commit used a stable app-identifying user agent string. Removing it changed request classification upstream and caused upstream failures in production environments.

## Fix applied
Restore the explicit `User-Agent` header in `fetchLnurlPayMetadata`.

