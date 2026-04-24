---
title: The state machine as a DRF action (and why wrong transitions return 409)
description: Seven states, four verbs, and a services layer that refuses illegal transitions with HTTP 409 Conflict. A clean way to model workflow in a REST API without inventing a new framework.
date: 2026-04-24
tags: [django, drf, state-machines, rest-api, patterns]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-visit-state-machine-as-drf-action/
---

## The problem REST never solved

Resources have CRUD. Workflows don't. A home-health visit moves through a lifecycle:

```
scheduled → assigned → en_route → on_site → completed
                                            ↘ cancelled
                                            ↘ missed
```

You can't model that as `PATCH /visits/:id` with a free-form `{status: "whatever"}` body and hope for the best. You need to refuse "on_site → scheduled," refuse "cancelled → completed," and do it at the API layer so every client gets the same rules.

## The shape: one verb per transition

In the Visit viewset, each transition is a **custom action** — its own URL, its own method, its own guard.

```python
# visits/views.py
class VisitViewSet(TenantScopedViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer

    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):
        visit = self.get_object()
        clinician_id = request.data.get("clinician_id")
        updated = services.assign_visit(visit, clinician_id, by=request.user)
        return Response(VisitSerializer(updated).data)

    @action(detail=True, methods=["post"], url_path="check-in")
    def check_in(self, request, pk=None):
        visit = self.get_object()
        updated = services.check_in(visit, request.data, by=request.user)
        return Response(VisitSerializer(updated).data)

    @action(detail=True, methods=["post"], url_path="check-out")
    def check_out(self, request, pk=None):
        visit = self.get_object()
        updated = services.check_out(visit, request.data, by=request.user)
        return Response(VisitSerializer(updated).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        visit = self.get_object()
        updated = services.cancel_visit(visit, reason=request.data.get("reason"))
        return Response(VisitSerializer(updated).data)
```

URLs come out as:

```
POST /visits/42/assign      {clinician_id: 17}
POST /visits/42/check-in    {lat, lon}
POST /visits/42/check-out   {notes}
POST /visits/42/cancel      {reason}
```

Each endpoint represents one edge in the state machine. Clients call the verb that describes what they want to happen; the server owns the rule for whether it's legal.

## The guard: `IllegalStateTransition` → HTTP 409

All the domain logic — including the refusal — lives in a services layer, not on the view:

```python
# visits/services.py
ALLOWED_TRANSITIONS = {
    "scheduled":  {"assigned", "cancelled"},
    "assigned":   {"en_route", "cancelled", "missed"},
    "en_route":   {"on_site", "cancelled", "missed"},
    "on_site":    {"completed"},
    "completed":  set(),   # terminal
    "cancelled":  set(),   # terminal
    "missed":     set(),   # terminal
}

class IllegalStateTransition(APIException):
    status_code = 409
    default_code = "illegal_transition"

def _transition(visit: Visit, to: str) -> Visit:
    if to not in ALLOWED_TRANSITIONS[visit.status]:
        raise IllegalStateTransition(
            f"Cannot move visit {visit.id} from {visit.status!r} to {to!r}"
        )
    visit.status = to
    visit.save(update_fields=["status"])
    return visit
```

DRF turns the `APIException` subclass into a clean `HTTP 409 Conflict` with the detail message in the body. No custom exception handler needed.

## Why 409, not 400 or 422?

Clients need to distinguish "your request was malformed" from "your request was fine but the state of the resource doesn't allow this":

- **400** — bad JSON, missing required field, wrong data type. Fix the request shape and retry.
- **422** — DRF's default validation error on a serializer. Same spirit as 400.
- **409 Conflict** — the canonical "your request was well-formed but the server state says no." Perfect for illegal transitions, version mismatches, and duplicate-resource errors.

A client seeing 409 knows to *refresh its view of the resource* and try a different action. A client seeing 400 knows to fix its form. These are different bugs; they deserve different codes.

## Tests become boring (in a good way)

```python
def test_cannot_check_in_before_assigned(api_client_as_clinician):
    visit = VisitFactory(status="scheduled")
    resp = api_client_as_clinician.post(f"/api/v1/visits/{visit.id}/check-in/",
                                        {"lat": 34.0, "lon": -118.0})
    assert resp.status_code == 409

def test_check_in_from_en_route_succeeds(api_client_as_clinician):
    visit = VisitFactory(status="en_route", clinician=api_client_as_clinician.user.clinician)
    resp = api_client_as_clinician.post(f"/api/v1/visits/{visit.id}/check-in/",
                                        {"lat": 34.0, "lon": -118.0})
    assert resp.status_code == 200
    assert resp.data["status"] == "on_site"
```

One pair of tests per edge, one pair per refused edge. The state machine has a finite number of transitions and a finite number of non-transitions. The test count is knowable.

## Why this beats a state-machine library

There are good libraries (`django-fsm`, `viewflow`). For a project with one or two state machines, they're more ceremony than they're worth. Seven states and an `ALLOWED_TRANSITIONS` dict fit on one screen. A new engineer reads the services module and immediately knows what's legal. Libraries hide the rule behind a decorator language.

The line where a library starts earning its keep is around five state machines, or when you need persistent history, or when states carry their own side-effects (on-entry, on-exit hooks). None of those apply to a CRUD-adjacent visit lifecycle.

## See also

- [Django Part 6 — DRF basics](../topics/web/django/part-06-drf-basics/) — serializers, viewsets, custom actions
- [Django Part 7 — Advanced ORM](../topics/web/django/part-07-advanced-orm/) — transactional updates
- Repo: [`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton) — full Visit state machine in `apps/api/visits/services.py`
