# oriz-mf-nav-api

Daily Indian mutual fund NAV snapshots — a clean-JSON proxy of [api.mfapi.in](https://api.mfapi.in/mf), with PWA-installable docs and a tiny in-browser playground.

> **Credit where it's due.** All scheme data is collected and curated by
> **[api.mfapi.in](https://api.mfapi.in)** (originally from
> **[AMFI India](https://www.amfiindia.com)**). This repo merely re-shapes
> their payload into a stable JSON contract and archives a daily snapshot so
> historical lookups are possible. If you're building anything serious, please
> consider supporting [api.mfapi.in](https://api.mfapi.in) directly.

## What it does

A nightly GitHub Actions job pulls the full scheme list from `api.mfapi.in/mf`,
normalises it to `{ code, name }`, and commits two files:

- `data/latest.json` — most recent snapshot (overwritten daily)
- `data/mf-nav-YYYY-MM-DD.json` — dated historical snapshot

Both are deployed to GitHub Pages and served from `https://mf-nav.api.oriz.in/`.

## Endpoints

| Path | Description |
|---|---|
| `GET /data/latest.json` | Most recent NAV snapshot |
| `GET /data/mf-nav-YYYY-MM-DD.json` | Historical daily snapshot |

### Response shape

```json
{
  "source": "https://api.mfapi.in/mf",
  "fetchedAt": "2026-06-22T01:00:12.345Z",
  "date": "2026-06-22",
  "count": 12345,
  "schemes": [
    { "code": 119551, "name": "Axis Bluechip Fund - Direct Plan - Growth" }
  ]
}
```

## Schedule

- Daily at **06:30 IST** (`01:00 UTC`) via GitHub Actions cron.
- Manual: `gh workflow run scrape.yml -R chirag127/oriz-mf-nav-api`.

## Local

```bash
npm run scrape   # writes data/latest.json + data/mf-nav-<today>.json
```

## License

MIT © 2026 Chirag Singhal. See [LICENSE](./LICENSE).

This project does not redistribute AMFI's data under a different license — it
simply mirrors public, open data with attribution. Not investment advice.
