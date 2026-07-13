# Apple Platform Testing Reference

Reviewed on 2026-07-13. Use with `validation.md` for exact commands and `supported-matrix.md` for destinations.

## Framework Choice

- Use Swift Testing for new unit and integration tests that call Swift code directly.
- Use XCTest for UI automation, performance measurement, Objective-C or C-family coverage, and existing suites where migration adds no teaching value.
- Keep both frameworks when each owns a useful testing distance.

## Testing Distances

| Distance | Proves | Default dependencies |
| --- | --- | --- |
| Domain unit | Invariants, transformations, errors | Real values, no mocks |
| Use case | Orchestration, cancellation, authorization | In-memory ports and deterministic clocks or IDs |
| Adapter contract | Translation to storage, HTTP, files, or system APIs | Local service, temporary directory, or narrow fake |
| Integration | Several real components work together | Local deterministic providers |
| UI | Critical user flow and framework wiring | Controlled app launch state |
| Device | Hardware, entitlements, delivery, thermal behavior | Physical device and explicit account setup |

## Test Design

- Test public behavior and observable side effects.
- Cover valid, boundary, invalid, empty, error, cancellation, permission-denied, migration, and offline behavior when the contract can reach those states.
- Use parameterized tests for repeated input and output cases.
- Use `#require` when later assertions need an unwrapped or validated value.
- Keep shared fixtures immutable or return a new instance per test.
- Keep valid and deliberately invalid fixtures separate. Never clamp, wrap, normalize, or silently repair invalid fixture data unless production owns the same repair.
- Inject clocks, identifiers, network clients, stores, and schedulers. Avoid sleeping to wait for eventual behavior.
- Preserve production validation rules in fakes and fixtures. Unsupported fake operations fail loudly.
- Let parallel tests run unless shared state requires isolation. Fix shared state before reaching for serialized execution.
- Test transactional failure cleanup so metadata, files, and attachments cannot become partial or orphaned.
- Test offline creation, app-style reconstruction, later sync, idempotent retry, cancellation, and server acknowledgement as separate state transitions.
- Put automated files in self-cleaning temporary directories. Keep manual fixtures under an ignored local path with a narrow reset command.

## UI and Accessibility Tests

- Launch with explicit arguments or environment values that select deterministic local data.
- Give controls stable accessibility identifiers only when user-facing labels are not a stable automation contract.
- Test a small set of critical flows. Keep business-rule combinations in unit tests.
- Include at least one large-text and VoiceOver-oriented manual or automated check for interface batches.

## Evidence

- Record toolchain, destination, scheme or package, command, result, and `.xcresult` location when Xcode tests run.
- Do not describe a preview, simulator, or mocked push response as device evidence.

## Primary Sources

- [Swift Testing](https://developer.apple.com/documentation/testing)
- [Xcode testing](https://developer.apple.com/documentation/xcode/testing)
- [Adding tests to an Xcode project](https://developer.apple.com/documentation/xcode/adding-tests-to-your-xcode-project)
- [Running tests and interpreting results](https://developer.apple.com/documentation/xcode/running-tests-and-interpreting-results)
- [Organizing tests with test plans](https://developer.apple.com/documentation/xcode/organizing-tests-to-improve-feedback)
