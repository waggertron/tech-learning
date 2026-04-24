---
title: Redis three ways — broker, cache, pub/sub — and how the async flow ties it together
description: One Redis instance, three logical DBs, three jobs. Celery runs the VRP, Django publishes events, a Node WebSocket gateway fans them out. How an "Optimize Day" click becomes an async pipeline that ends with a map pin moving.
date: 2026-04-24
tags: [redis, celery, websockets, concurrency, queueing]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-redis-three-roles-and-async-fanout/
---

## One Redis, three jobs

Running three separate services is a tempting mistake. For a moderate-scale app, one Redis 7 instance handles all of it — you just give each role its own logical database:

```
redis-server
├── DB 0   — Celery broker (task queue)
├── DB 1   — Django cache (key/value)
└── DB 2   — Pub/Sub channels (real-time fan-out)
```

Redis DBs are a pre-cluster legacy feature, and in a production cluster they go away. But on a single instance they give you namespace isolation for free. Flushing cache (`FLUSHDB` on 1) doesn't nuke the queue. Monitoring is per-DB. The Celery `CELERY_BROKER_URL=redis://cache:6379/0` and cache `CACHE_URL=redis://cache:6379/1` don't step on each other.

## The async pipeline: "Optimize Day" end-to-end

A dispatcher clicks a button. What happens:

### 1. HTTP 202, not 200

```python
# scheduling/views.py
@api_view(["POST"])
def optimize_day(request):
    date = request.data["date"]
    tenant_id = request.tenant_id
    async_result = tasks.optimize_day.delay(tenant_id, date)
    return Response(
        {"job_id": async_result.id, "status": "queued"},
        status=202,
    )
```

The status code is deliberate. **202 Accepted** means "I got your request; it'll happen later." It sets client expectations correctly: don't block on this response, watch for the event.

### 2. Celery's broker picks up the task

Django pushed the task onto `LPUSH celery` in DB 0. A Celery worker is long-polling that key via `BRPOP`. As soon as the task lands, the worker pulls it and starts executing:

```python
# scheduling/tasks.py
@shared_task(bind=True, max_retries=2)
def optimize_day(self, tenant_id: int, date: str):
    with tenant_context(tenant_id):       # scope ORM queries
        visits = Visit.objects.filter(...).only(...)
        clinicians = Clinician.objects.filter(...).only(...)
        matrix = build_distance_matrix(clinicians, visits)
        result = vrp.solve(clinicians, visits, matrix)
        _write_route_plan(result, date)
        _publish_results(tenant_id, result)
```

Three observations worth calling out:

- **`@shared_task(bind=True)`** — `bind=True` gives the task access to `self`, which you need for retries and logging.
- **`max_retries=2`** — the VRP solver is deterministic; a failure is almost always a code bug or a missing row, not a transient issue. Two retries is a safety net, not a recovery strategy.
- **`with tenant_context(...)`** — Celery tasks don't run through the HTTP middleware, so the tenant context has to be set explicitly. This is the #1 bug source in multi-tenant Celery code.

### 3. The pub/sub side-effect

When the task finishes, it publishes to Redis DB 2:

```python
def _publish_results(tenant_id, result):
    redis_pubsub.publish(
        channel=f"tenant:{tenant_id}:events",
        message=json.dumps({
            "type": "schedule.optimized",
            "visits_changed": result.visit_ids,
            "solve_time_ms": result.solve_ms,
        }),
    )
```

`PUBLISH` is fire-and-forget. If there are zero subscribers, the message evaporates. That's fine — it also means the API/worker aren't coupled to the WebSocket layer at all. A downed `rt-node` doesn't cause any write error upstream.

### 4. The WebSocket gateway fans out

`rt-node` is a tiny (~500 LOC) Node + TypeScript service. It runs `ws` for WebSockets and `ioredis` for Redis:

```ts
// rt-node/src/gateway.ts
const sub = new Redis({ db: 2 });
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", async (ws, req) => {
    const { tenantId, role } = await authenticateWithDjango(req);
    const channel = `tenant:${tenantId}:events`;
    sub.subscribe(channel);
    sub.on("message", (ch, msg) => {
        if (ch === channel) ws.send(msg);
    });
    ws.on("close", () => sub.unsubscribe(channel));
});
```

Deliberately dumb. No business logic. No DB access. No authentication logic of its own — it asks Django whether a token is valid. The whole point of having a separate service here is to **keep long-lived WebSocket connections off the Django process**. Django under Gunicorn/Uvicorn holds a worker per connection; Node with `ws` happily holds ten thousand.

### 5. The browser updates

The ops console has a persistent WS connection open. When `schedule.optimized` arrives:

```ts
ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === "schedule.optimized") {
        // refetch /routeplans/, re-render the map
        queryClient.invalidateQueries(["routeplans"]);
    }
};
```

No polling. Dispatchers see the new routes appear within ~300ms of the Celery task finishing — the latency is dominated by the VRP solve itself, not the delivery pipeline.

## Why Celery, not Django async views, not Python threads

Three tools, three jobs:

- **Django async views** — good for concurrent external HTTP during a single request. Bad for any CPU-bound work (GIL) or anything that outlives the request.
- **Python `threading`** — good for I/O concurrency in a synchronous program. Bad for anything that should survive a process restart or run off the request path.
- **Celery** — good for "I need this to happen eventually, I don't care which worker, I need retries and a job ID." The VRP solve is CPU-bound (≈10s), outlives the request, and benefits from retries. Textbook Celery.

Async views are fine for a dashboard endpoint fanning out to Stripe + an analytics API. They're not a replacement for a task queue.

## Pitfalls worth knowing

- **`.delay()` inside a transaction.** The task may dequeue and run *before* the transaction commits, reading stale state. Fix: `transaction.on_commit(lambda: task.delay(id))`.
- **Model instances as arguments.** Celery serializes args as JSON. A `Visit` instance becomes nonsense on the other side. Pass primary keys; re-fetch in the task.
- **Silent backlog.** A queue that's full but not erroring is the worst outcome — users see delays without alerts. Monitor queue depth (Flower, or a `LLEN celery` Prometheus exporter).
- **`PUBLISH` isn't durable.** If the subscriber disconnects, messages are lost. For truly critical events, use Redis Streams (`XADD`/`XREAD`) or a proper broker like RabbitMQ. For UI fan-out where the client re-syncs on reconnect anyway, fire-and-forget is fine.
- **Context leakage between tasks.** `_tenant_context` is a `ContextVar`. Clean it up at the end of every task, or use a decorator. Leaks are invisible until they cause a cross-tenant read.

## The surprisingly simple mental model

HTTP requests: sync, short, bounded response time, return JSON.
Background tasks: async, minutes-long OK, retries allowed, side-effect via pub/sub.
WebSockets: long-lived, read-only, updated by pub/sub messages, never queried by clients for state.

Keep those three boundaries clean and most of the distributed-systems ugliness stays manageable.

## See also

- [Django Part 9 — Async and background tasks](../topics/web/django/part-09-async-and-background-tasks/) — Celery + Channels depth
- [OR-Tools VRP with skill constraints](./2026-04-24-or-tools-vrp-with-skill-constraints/) — the task that runs inside this pipeline
- [ML re-ranker inside an OR-Tools objective](./2026-04-24-ml-reranker-inside-or-tools-objective/) — what else is in the worker
- Repo: [`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton) — architecture doc has the full sequence diagrams
