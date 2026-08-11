import type { OntologyEvidence } from "./customer-ontology";

const domains = ["banking", "insurance", "united_nations"] as const;
type Domain = (typeof domains)[number];

function emptyCounts(): Record<Domain, number> {
  return { banking: 0, insurance: 0, united_nations: 0 };
}

export function buildOntologyCoverage(records: readonly OntologyEvidence[]) {
  const jurisdictionMap = new Map<string, OntologyEvidence[]>();
  for (const record of records) {
    const existing = jurisdictionMap.get(record.country) ?? [];
    existing.push(record);
    jurisdictionMap.set(record.country, existing);
  }

  const jurisdictions = [...jurisdictionMap.entries()]
    .map(([jurisdiction, items]) => {
      const domainCounts = emptyCounts();
      for (const item of items) domainCounts[item.domain as Domain] += 1;
      return {
        jurisdiction,
        regions: [...new Set(items.map((item) => item.region))].sort(),
        evidenceCount: items.length,
        institutionCount: new Set(items.map((item) => item.institution)).size,
        sourceCount: new Set(items.map((item) => item.sourceUrl)).size,
        domainCounts,
        coveredDomains: domains.filter((domain) => domainCounts[domain] > 0),
        missingDomains: domains.filter((domain) => domainCounts[domain] === 0),
      };
    })
    .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction));

  const regionNames = [...new Set(records.map((record) => record.region))].sort();
  const regions = regionNames.map((region) => {
    const items = records.filter((record) => record.region === region);
    const domainCounts = emptyCounts();
    for (const item of items) domainCounts[item.domain as Domain] += 1;
    return {
      region,
      jurisdictionCount: new Set(items.map((item) => item.country)).size,
      evidenceCount: items.length,
      institutionCount: new Set(items.map((item) => item.institution)).size,
      domainCounts,
      missingDomains: domains.filter((domain) => domainCounts[domain] === 0),
    };
  });

  const domainJurisdictionCounts = Object.fromEntries(
    domains.map((domain) => [
      domain,
      jurisdictions.filter((item) => item.domainCounts[domain] > 0).length,
    ]),
  ) as Record<Domain, number>;

  return {
    scopeNote: "Coverage describes only curated official evidence currently stored; it is not a list of every country or institution worldwide.",
    evidenceCount: records.length,
    jurisdictionCount: jurisdictions.length,
    completeJurisdictionCount: jurisdictions.filter((item) => item.missingDomains.length === 0).length,
    incompleteJurisdictionCount: jurisdictions.filter((item) => item.missingDomains.length > 0).length,
    domainJurisdictionCounts,
    jurisdictions,
    regions,
  };
}
