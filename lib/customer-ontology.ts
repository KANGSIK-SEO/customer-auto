import ontology from "../data/customer-service-ontology.json";

export type OntologyRecord = (typeof ontology.records)[number] & { score: number };

const domainTerms: Record<string, string[]> = {
  banking: ["bank", "account", "card", "transaction", "fraud", "scam", "phishing", "은행", "계좌", "카드", "거래", "사기", "피싱"],
  insurance: ["insurance", "insurer", "claim", "policy", "coverage", "보험", "보험금", "청구", "약관", "보장"],
  united_nations: ["united nations", "unhcr", "ohchr", "unv", "asylum", "refugee", "유엔", "난민", "망명", "인권", "봉사"],
};

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKC");
}

function tokens(value: string) {
  return normalize(value).match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function retrieveOntology(question: string, limit = 4): OntologyRecord[] {
  const normalized = normalize(question);
  const queryTokens = new Set(tokens(question).filter((token) => token.length > 1));

  return ontology.records
    .map((record) => {
      const searchable = normalize([
        record.institution,
        record.country,
        record.region,
        record.question,
        record.answer,
        record.action,
        record.contact,
        ...record.intents,
      ].join(" "));
      let score = 0;
      for (const intent of record.intents) {
        if (normalized.includes(normalize(intent))) score += 8;
      }
      if (normalized.includes(normalize(record.institution))) score += 10;
      if (normalized.includes(normalize(record.country))) score += 6;
      const institutionLead = tokens(record.institution)[0];
      if (institutionLead && institutionLead.length > 2 && queryTokens.has(institutionLead)) score += 5;
      for (const token of queryTokens) {
        if (searchable.includes(token)) score += 1;
      }
      if (domainTerms[record.domain]?.some((term) => normalized.includes(term))) score += 2;
      return { ...record, score };
    })
    .filter((record) => record.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function ontologyPrompt(records: OntologyRecord[]) {
  if (!records.length) return "";
  return records.map((record) => {
    const { score, ...evidence } = record;
    void score;
    return JSON.stringify(evidence);
  }).join("\n");
}

export const ontologyMetadata = {
  name: ontology.name,
  version: ontology.version,
  recordCount: ontology.records.length,
  countries: [...new Set(ontology.records.map((record) => record.country))].sort(),
  regions: [...new Set(ontology.records.map((record) => record.region))].sort(),
  domainCounts: Object.fromEntries(
    Object.keys(domainTerms).map((domain) => [
      domain,
      ontology.records.filter((record) => record.domain === domain).length,
    ]),
  ),
};
