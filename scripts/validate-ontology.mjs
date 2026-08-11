import { readFile } from "node:fs/promises";

const ontology = JSON.parse(await readFile(new URL("../data/customer-service-ontology.json", import.meta.url), "utf8"));
const allowedDomains = new Set(["banking", "insurance", "united_nations"]);
const required = ["id", "domain", "institution", "country", "region", "intents", "question", "answer", "action", "contact", "sourceUrl", "verifiedOn"];
const officialHosts = [
  "bankofamerica.com", "dbs.com.sg", "commbank.com.au", "hsbc.co.uk", "icicibank.com",
  "standardbank.co.za", "emiratesnbd.com", "allianz.com", "sanlam.co.za", "mapfre.com",
  "axa.co.uk", "prudential.com.sg", "tokiomarine.com", "un.org", "unhcr.org", "ohchr.org", "unv.org",
  "rbcroyalbank.com", "bbva.mx", "kbstar.com", "allianz.fr", "aia.com.hk",
  "deutsche-bank.de", "smbc.co.jp", "bbva.com.ar", "itau.com.br", "allianz.de",
  "portoseguro.com.br", "zurich.com.ar",
  "gtbank.com", "kcbgroup.com", "anz.co.nz", "bdo.com.ph", "britam.com",
  "leadway.com", "aia.co.nz", "axa.com.ph",
  "tokiomarine-nichido.co.jp", "axa.mx", "geico.com",
];

const errors = [];
const ids = new Set();
const counts = Object.fromEntries([...allowedDomains].map((domain) => [domain, 0]));
const regions = new Set();
const countries = new Set();

for (const [index, record] of ontology.records.entries()) {
  for (const field of required) {
    if (record[field] === undefined || record[field] === "" || (Array.isArray(record[field]) && !record[field].length)) {
      errors.push(`record ${index} (${record.id ?? "no id"}): missing ${field}`);
    }
  }
  if (ids.has(record.id)) errors.push(`duplicate id: ${record.id}`);
  ids.add(record.id);
  if (!allowedDomains.has(record.domain)) errors.push(`${record.id}: invalid domain ${record.domain}`);
  else counts[record.domain] += 1;
  regions.add(record.region);
  countries.add(record.country);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.verifiedOn)) errors.push(`${record.id}: invalid verifiedOn`);
  try {
    const host = new URL(record.sourceUrl).hostname.replace(/^www\./, "");
    if (!officialHosts.some((official) => host === official || host.endsWith(`.${official}`))) {
      errors.push(`${record.id}: source host is not in official registry: ${host}`);
    }
  } catch {
    errors.push(`${record.id}: invalid sourceUrl`);
  }
}

for (const [domain, count] of Object.entries(counts)) {
  if (count < 6) errors.push(`${domain}: expected at least 6 records, found ${count}`);
}
if (ontology.records.length < 62) errors.push(`expected at least 62 records, found ${ontology.records.length}`);
if (regions.size < 9) errors.push(`expected at least 9 regions, found ${regions.size}`);
if (countries.size < 28) errors.push(`expected at least 28 countries or global jurisdictions, found ${countries.size}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({ records: ontology.records.length, domains: counts, countries: [...countries].sort(), regions: [...regions].sort(), uniqueSources: new Set(ontology.records.map((record) => record.sourceUrl)).size }, null, 2));
