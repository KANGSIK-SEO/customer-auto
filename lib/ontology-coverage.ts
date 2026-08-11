import type { OntologyEvidence } from "./customer-ontology";
import unMemberStates from "../data/un-member-states.json";

const domains = ["banking", "insurance", "united_nations"] as const;
type Domain = (typeof domains)[number];

function emptyCounts(): Record<Domain, number> {
  return { banking: 0, insurance: 0, united_nations: 0 };
}

export function buildOntologyCoverage(
  records: readonly OntologyEvidence[],
  worldwideRecords: readonly OntologyEvidence[] = records,
) {
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

  const targetCountries = [...unMemberStates.countries].sort();
  const targetCountrySet = new Set(targetCountries);
  const worldwideJurisdictionMap = new Map<string, OntologyEvidence[]>();
  for (const record of worldwideRecords) {
    const existing = worldwideJurisdictionMap.get(record.country) ?? [];
    existing.push(record);
    worldwideJurisdictionMap.set(record.country, existing);
  }
  const targetStatuses = targetCountries.map((country) => {
    const items = worldwideJurisdictionMap.get(country) ?? [];
    const domainCounts = emptyCounts();
    for (const item of items) domainCounts[item.domain as Domain] += 1;
    const missingDomains = domains.filter((domain) => domainCounts[domain] === 0);
    return {
      country,
      evidenceCount: items.length,
      domainCounts,
      missingDomains,
    };
  });
  const countriesWithAnyEvidence = targetStatuses.filter((item) => item.evidenceCount > 0);
  const completeTargetCountries = targetStatuses.filter((item) => item.missingDomains.length === 0);
  const partiallyCoveredCountries = countriesWithAnyEvidence.filter((item) => item.missingDomains.length > 0);
  const uncoveredCountries = targetStatuses.filter((item) => item.evidenceCount === 0);
  const percentage = (count: number) => Number(((count / targetCountries.length) * 100).toFixed(2));

  const worldwideTargetCoverage = {
    standard: unMemberStates.name,
    sourceUrl: unMemberStates.sourceUrl,
    sourceNote: unMemberStates.sourceNote,
    verifiedOn: unMemberStates.verifiedOn,
    targetCountryCount: targetCountries.length,
    countriesWithAnyEvidenceCount: countriesWithAnyEvidence.length,
    completeCountryCount: completeTargetCountries.length,
    partiallyCoveredCountryCount: partiallyCoveredCountries.length,
    uncoveredCountryCount: uncoveredCountries.length,
    anyEvidenceCoveragePercent: percentage(countriesWithAnyEvidence.length),
    completeCoveragePercent: percentage(completeTargetCountries.length),
    partiallyCoveredCountries,
    uncoveredCountries: uncoveredCountries.map((item) => item.country),
    nonMemberOrSyntheticJurisdictions: [...worldwideJurisdictionMap.keys()]
      .filter((country) => !targetCountrySet.has(country)),
  };

  return {
    scopeNote: "Curated coverage and worldwide target coverage are reported separately. Worldwide progress uses the 193 UN Member States as a measurable country roster; it does not imply every institution or every possible FAQ has been collected.",
    evidenceCount: records.length,
    jurisdictionCount: jurisdictions.length,
    completeJurisdictionCount: jurisdictions.filter((item) => item.missingDomains.length === 0).length,
    incompleteJurisdictionCount: jurisdictions.filter((item) => item.missingDomains.length > 0).length,
    domainJurisdictionCounts,
    worldwideTargetCoverage,
    jurisdictions,
    regions,
  };
}
