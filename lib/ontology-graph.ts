import type { OntologyEvidence } from "./customer-ontology";

export type OntologyNodeType =
  | "evidence"
  | "domain"
  | "institution"
  | "country"
  | "region"
  | "intent"
  | "official_source";

export type OntologyNode = {
  id: string;
  type: OntologyNodeType;
  label: string;
  properties?: Record<string, string | string[]>;
};

export type OntologyEdge = {
  from: string;
  predicate:
    | "belongs_to_domain"
    | "provided_by"
    | "applies_in"
    | "part_of_region"
    | "addresses_intent"
    | "supported_by"
    | "published_by";
  to: string;
};

function entityId(type: OntologyNodeType, label: string) {
  return `${type}:${encodeURIComponent(label.normalize("NFKC").toLocaleLowerCase())}`;
}

export function buildOntologyGraph(records: readonly OntologyEvidence[]) {
  const nodes = new Map<string, OntologyNode>();
  const edges = new Map<string, OntologyEdge>();

  const addNode = (node: OntologyNode) => nodes.set(node.id, node);
  const addEdge = (edge: OntologyEdge) => {
    edges.set(`${edge.from}|${edge.predicate}|${edge.to}`, edge);
  };

  for (const record of records) {
    const evidenceId = `evidence:${record.id}`;
    const domainId = entityId("domain", record.domain);
    const institutionId = entityId("institution", record.institution);
    const countryId = entityId("country", record.country);
    const regionId = entityId("region", record.region);
    const sourceId = entityId("official_source", record.sourceUrl);

    addNode({
      id: evidenceId,
      type: "evidence",
      label: record.question,
      properties: {
        answer: record.answer,
        action: record.action,
        contact: record.contact,
        verifiedOn: record.verifiedOn,
      },
    });
    addNode({ id: domainId, type: "domain", label: record.domain });
    addNode({ id: institutionId, type: "institution", label: record.institution });
    addNode({ id: countryId, type: "country", label: record.country });
    addNode({ id: regionId, type: "region", label: record.region });
    addNode({
      id: sourceId,
      type: "official_source",
      label: record.sourceUrl,
      properties: { url: record.sourceUrl, verifiedOn: record.verifiedOn },
    });

    addEdge({ from: evidenceId, predicate: "belongs_to_domain", to: domainId });
    addEdge({ from: evidenceId, predicate: "provided_by", to: institutionId });
    addEdge({ from: evidenceId, predicate: "applies_in", to: countryId });
    addEdge({ from: countryId, predicate: "part_of_region", to: regionId });
    addEdge({ from: evidenceId, predicate: "supported_by", to: sourceId });
    addEdge({ from: sourceId, predicate: "published_by", to: institutionId });

    for (const intent of record.intents) {
      const intentId = entityId("intent", intent);
      addNode({ id: intentId, type: "intent", label: intent });
      addEdge({ from: evidenceId, predicate: "addresses_intent", to: intentId });
    }
  }

  const nodeList = [...nodes.values()];
  const edgeList = [...edges.values()];
  const nodeCounts = nodeList.reduce<Record<string, number>>((counts, node) => {
    counts[node.type] = (counts[node.type] ?? 0) + 1;
    return counts;
  }, {});

  return {
    schemaVersion: "1.0",
    nodeCount: nodeList.length,
    edgeCount: edgeList.length,
    nodeCounts,
    nodes: nodeList,
    edges: edgeList,
  };
}
