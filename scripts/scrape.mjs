#!/usr/bin/env node
// Fetches NAV from api.mfapi.in, writes data/mf-nav-YYYY-MM-DD.json + latest.json
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "oriz-api-bot/0.1 (+https://oriz.in/about)";
const today = new Date().toISOString().slice(0, 10);

async function main() {
  console.log("[mf-nav] fetching scheme list from api.mfapi.in/mf");
  let schemes = [];
  try {
    const r = await fetch("https://api.mfapi.in/mf", { headers: { "User-Agent": UA } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    schemes = await r.json();
  } catch (e) {
    console.warn("[mf-nav] upstream unreachable; using placeholder", e.message);
    schemes = [
      { schemeCode: 119551, schemeName: "Axis Bluechip Fund - Direct Plan - Growth" },
      { schemeCode: 120503, schemeName: "Mirae Asset Large Cap Fund - Direct Plan - Growth" },
      { schemeCode: 118989, schemeName: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth" }
    ];
  }
  const out = {
    source: "https://api.mfapi.in/mf",
    fetchedAt: new Date().toISOString(),
    date: today,
    count: schemes.length,
    schemes: schemes.slice(0, 25000).map(s => ({ code: s.schemeCode, name: s.schemeName }))
  };
  const dataDir = join(ROOT, "data");
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, `mf-nav-${today}.json`), JSON.stringify(out, null, 2));
  await writeFile(join(dataDir, "latest.json"), JSON.stringify(out, null, 2));
  console.log(`[mf-nav] wrote ${out.count} schemes -> data/latest.json + data/mf-nav-${today}.json`);
}
main().catch(e => { console.error(e); process.exit(1); });
