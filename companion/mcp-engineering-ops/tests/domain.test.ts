import assert from "node:assert/strict";
import test from "node:test";

import {
  DuplicateRequestError,
  createExampleIncidentService,
} from "../src/domain/incidents.js";

test("adds an incident note once for an idempotency key", () => {
  const incidents = createExampleIncidentService();
  const requestId = "9cf1562e-9005-440a-9017-b646c60a7411";

  const updated = incidents.addNote("INC-204", "Rollback started.", requestId);
  assert.equal(updated.notes.at(-1), "Rollback started.");
  assert.throws(
    () => incidents.addNote("INC-204", "Rollback started.", requestId),
    DuplicateRequestError,
  );
});

test("bounds search results and returns copies", () => {
  const incidents = createExampleIncidentService();
  const results = incidents.searchIncidents("checkout");

  assert.equal(results.length, 1);
  results[0].notes.push("local mutation");
  assert.equal(incidents.getIncident("INC-204").notes.length, 1);
});
