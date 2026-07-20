export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type Incident = {
  id: string;
  service: string;
  severity: IncidentSeverity;
  status: "investigating" | "monitoring" | "resolved";
  notes: string[];
};

export class IncidentNotFoundError extends Error {}
export class DuplicateRequestError extends Error {}

export class IncidentService {
  readonly #incidents = new Map<string, Incident>();
  readonly #requestIds = new Set<string>();

  constructor(seed: Incident[] = []) {
    for (const incident of seed) {
      this.#incidents.set(incident.id, structuredClone(incident));
    }
  }

  getIncident(incidentId: string): Incident {
    const incident = this.#incidents.get(incidentId);
    if (!incident) {
      throw new IncidentNotFoundError(`Incident ${incidentId} was not found.`);
    }
    return structuredClone(incident);
  }

  searchIncidents(service?: string): Incident[] {
    return [...this.#incidents.values()]
      .filter((incident) => !service || incident.service === service)
      .slice(0, 20)
      .map((incident) => structuredClone(incident));
  }

  addNote(incidentId: string, note: string, requestId: string): Incident {
    if (this.#requestIds.has(requestId)) {
      throw new DuplicateRequestError(`Request ${requestId} was already applied.`);
    }

    const incident = this.getIncident(incidentId);
    incident.notes.push(note);
    this.#incidents.set(incidentId, incident);
    this.#requestIds.add(requestId);
    return structuredClone(incident);
  }
}

export function createExampleIncidentService(): IncidentService {
  return new IncidentService([
    {
      id: "INC-204",
      service: "checkout",
      severity: "high",
      status: "investigating",
      notes: ["Elevated payment latency detected."],
    },
    {
      id: "INC-205",
      service: "catalog",
      severity: "medium",
      status: "monitoring",
      notes: ["Cache hit rate recovered after rollback."],
    },
  ]);
}
