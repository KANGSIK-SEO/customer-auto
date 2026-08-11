import { readFile } from "node:fs/promises";

const ontology = JSON.parse(
  await readFile(new URL("../data/customer-service-ontology.json", import.meta.url), "utf8"),
);
const urls = [...new Set(ontology.records.map((record) => record.sourceUrl))];
const concurrency = 18;

async function inspect(url) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: {
        "user-agent": "evollard-ontology-source-check/1.0 (+https://customer-auto-eight.vercel.app/)",
        accept: "text/html,application/pdf,application/json;q=0.9,*/*;q=0.8",
        range: "bytes=0-2047",
      },
    });
    await response.body?.cancel();
    const status = response.status;
    const category = status >= 200 && status < 400
      ? "healthy"
      : [401, 403, 405, 429].includes(status)
        ? "restricted"
        : [404, 410].includes(status)
          ? "broken"
          : status >= 500
            ? "server_error"
            : "unexpected";
    return {
      url,
      category,
      status,
      finalUrl: response.url,
      redirected: response.redirected,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      url,
      category: "network_error",
      status: null,
      error: error instanceof Error ? error.name : "UnknownError",
      latencyMs: Date.now() - startedAt,
    };
  }
}

const results = [];
for (let index = 0; index < urls.length; index += concurrency) {
  results.push(...await Promise.all(urls.slice(index, index + concurrency).map(inspect)));
}

const categories = Object.fromEntries(
  ["healthy", "restricted", "broken", "server_error", "unexpected", "network_error"]
    .map((category) => [category, results.filter((result) => result.category === category).length]),
);
const report = {
  checkedAt: new Date().toISOString(),
  sourceCount: urls.length,
  categories,
  results,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(JSON.stringify({ checkedAt: report.checkedAt, sourceCount: report.sourceCount, categories }, null, 2));
  for (const result of results.filter((item) => item.category !== "healthy")) {
    console.log(`${result.category}\t${result.status ?? "-"}\t${result.url}`);
  }
}

if (categories.broken > 0) process.exitCode = 1;
