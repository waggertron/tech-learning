# Swift Runner Public API Policy

The Swift runner coordinator exposes a small asynchronous job API. The shared service implementation now enforces the R2.3 request, ownership, idempotency, quota, polling, queue, and origin policy before any production worker is allocated.

This policy is implemented and tested locally. It does not make the runner public. The loopback command still binds only to `127.0.0.1`, and Gate 1B still requires isolated staging workers, privacy checks, operations controls, GitHub Pages configuration, and live end-to-end evidence.

## Endpoints

- `GET /v1/swift/capabilities`
- `POST /v1/swift/jobs`
- `GET /v1/swift/jobs/{jobID}`
- `DELETE /v1/swift/jobs/{jobID}`

Every response uses JSON, `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`. Production must require the exact published site origin. CORS limits browser access but is not authentication and does not replace rate limiting.

## Submission Contract

`POST /v1/swift/jobs` accepts exactly four fields:

```json
{
  "harnessID": "swift-standard-v1",
  "requestID": "<opaque-client-request-id>",
  "source": "print(\"ready\")",
  "toolchain": "6.3.3"
}
```

The coordinator rejects missing and extra fields, invalid JSON, a non-JSON content type, bodies above 68 KiB, source above 64 KiB, unknown harnesses, unsupported toolchains, and invalid request identifiers before calling an executor. Compiler flags, environment variables, image names, packages, filesystem paths, and shell commands are not request fields.

Accepted jobs receive a random UUID job identifier. Identifiers are not sequential and are scoped to the client identity that created them. A different client receives the same `404` response for an unknown job and a job it does not own, so the API does not confirm another client's job exists.

## Idempotency

`requestID` is an idempotency key within one client identity and the result-retention window. The coordinator hashes the complete validated input without logging or retaining a second source copy.

- The first accepted request returns `202` and a job ID.
- An exact repeat returns `200` and the original job ID without consuming another submission quota unit or allocating another executor.
- Reusing the request ID with different source, harness, or toolchain returns `409`.
- When the terminal job expires, its idempotency record expires with it.

Execution is not automatically retried. A duplicate compiler or program run could have nondeterministic behavior and would weaken quota accounting.

## Default Limits

The shared service defaults are:

| Boundary | Limit |
| --- | --- |
| Active jobs across the service | 2 |
| Queued jobs across the service | 16 |
| Retained job records | 256 |
| Nonterminal jobs per client | 2 |
| Accepted submissions per client | 12 per 60 seconds |
| Job polls per client | 300 per 60 seconds |
| Browser polling cadence | 250 milliseconds |
| Terminal result retention | 5 minutes |
| Source size | 64 KiB |
| Combined output | 64 KiB |
| Compilation | 10 seconds |
| Program execution | 3 seconds |

Rate-limited requests return `429` and `Retry-After`. Queue and per-client checks happen before executor allocation. Cancellation remains available when a polling or submission window is full so a client can stop its owned work.

These limits are service defaults, not a promise that staging may increase them. R2.7 must connect them to metrics, spending controls, alerts, and the emergency switch.

## Client Identity

The service accepts an injected client-identity resolver. Loopback development uses the direct socket address. A production deployment must resolve identity only from transport metadata supplied by its trusted edge and must not trust a client-provided forwarding header from an arbitrary peer.

The resolver value is used for rate windows, outstanding-job limits, idempotency, reads, and cancellation. It is not returned to the browser or written into job output. Staging must prove the selected Fly Proxy and coordinator configuration supplies a stable value for one job lifecycle. If it does not, the production adapter needs a signed anonymous session capability before GitHub Pages is connected.

## Origin Policy

The service supports a production mode that rejects requests without an `Origin` header and rejects origins outside an exact allowlist. The deployed allowlist must contain only the published GitHub Pages origin and explicit staging origin. Localhost values belong only to local or staging configuration.

Origin checks happen before body parsing and executor allocation. They reduce drive-by browser use, but command-line clients can set an Origin header. Abuse resistance therefore depends on client quotas, the global queue, worker isolation, spending controls, and the emergency switch as well.

## Retention and Cleanup

Source remains in coordinator memory only while a job is nonterminal. Terminal transition removes it from the job record. The retained snapshot contains bounded diagnostics, standard output, standard error, timing, status, and toolchain evidence. After five minutes, the snapshot, request digest, and idempotency mapping are removed.

The shared service aborts active jobs during shutdown and waits for executor cleanup. The production coordinator must additionally delete or reconcile its disposable worker Machine before releasing the concurrency slot.

## Validation

Run the deterministic coordinator policy suite without Docker or credentials:

```bash
npm run test:swift-runner-service
```

The suite covers exact CORS, optional required-origin mode, request validation, size rejection, idempotent duplicate handling, conflicting request IDs, per-client submission and polling windows, ownership, outstanding-job limits, global queue bounds, real cancellation propagation, terminal expiration, and rejection before executor allocation.

Run the browser contract and component suites after changing polling or response behavior:

```bash
npm run test:swift-runner-contract
npm run test:swift-repl
```

## Remaining Production Work

R2.3 is complete at the shared coordinator boundary. The endpoint remains unavailable on the live site until later gates prove:

- The provider adapter derives trustworthy client identity.
- Every accepted job enters its own disposable worker boundary.
- Worker networking, credentials, filesystems, resources, and deletion satisfy R2.4.
- Source and result retention satisfy R2.5.
- Staging, metrics, alerts, spending limits, rollback, and the emergency switch satisfy R2.6 and R2.7.
- GitHub Pages configuration and published-origin browser evidence satisfy R2.8 and R2.9.

The live service must fail closed. If identity, quota storage, worker isolation, or cleanup is unavailable, new submissions are rejected and the editor remains usable.
