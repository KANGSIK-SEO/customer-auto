import { NextResponse } from "next/server";
import { ontologyMetadata, retrieveOntology } from "../../../lib/customer-ontology";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json({
      ...ontologyMetadata,
      domains: ["banking", "insurance", "united_nations"],
      usage: "/api/ontology?q=your+question",
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
