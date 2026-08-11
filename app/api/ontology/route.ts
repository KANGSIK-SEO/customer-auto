import { NextResponse } from "next/server";
import {
  ontologyMetadata,
  ontologyRecords,
  retrieveOntology,
} from "../../../lib/customer-ontology";
import { buildOntologyGraph } from "../../../lib/ontology-graph";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const view = (searchParams.get("view") ?? "").trim();
  const domain = (searchParams.get("domain") ?? "").trim();
  const country = (searchParams.get("country") ?? "").trim();

  if (view === "graph") {
    const validDomains = new Set(["banking", "insurance", "united_nations"]);
    if (domain && !validDomains.has(domain)) {
      return NextResponse.json({ error: "지원하지 않는 domain입니다." }, { status: 400 });
    }
    const selected = ontologyRecords.filter((record) =>
      (!domain || record.domain === domain) &&
      (!country || record.country.toLocaleLowerCase() === country.toLocaleLowerCase()),
    );
    return NextResponse.json({
      filters: { domain: domain || null, country: country || null },
      evidenceCount: selected.length,
      ...buildOntologyGraph(selected),
    });
  }

  if (!query) {
    return NextResponse.json({
      ...ontologyMetadata,
      domains: ["banking", "insurance", "united_nations"],
      usage: "/api/ontology?q=your+question",
      graphUsage: "/api/ontology?view=graph&domain=banking&country=Canada",
    });
  }

  if (query.length > 500) {
    return NextResponse.json({ error: "질문은 500자 이내로 입력해 주세요." }, { status: 400 });
  }

  const records = retrieveOntology(query).map(({ score, ...record }) => ({
    ...record,
    relevanceScore: score,
  }));
  return NextResponse.json({ query, count: records.length, records });
}
