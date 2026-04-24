---
title: Fuzz tests
description: Automatic input generation to find edge cases, crashes, and vulnerabilities your example-based tests missed. Property-based testing, coverage-guided fuzzing, and modern LLM-assisted corpora.
parent: testing
tags: [fuzz-testing, property-based-testing, hypothesis, security]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What fuzz testing is

**Fuzz testing is generating lots of inputs — usually with structure but partly random — and checking that your code either produces the right output or fails safely.** Where an example-based unit test asserts one input gives one output, a fuzz test asserts *a property* holds over many inputs.

Two related flavors:

- **Property-based testing** (PBT) — Hypothesis, QuickCheck, fast-check. Inputs are generated from a typed spec; assertions are about invariants.
- **Coverage-guided fuzzing** (CGF) — AFL, libFuzzer, go-fuzz, Jazzer. Inputs are mutated bytes; the fuzzer learns which mutations reach new code paths and tries more like them.

PBT is the developer-facing tool; CGF is the security-facing tool. Both have earned their place in any serious suite.

## Property-based testing

### The idea

Instead of:

```python
def test_sort_three_numbers():
    assert sorted([3, 1, 2]) == [1, 2, 3]
```

You write:

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_sort_is_idempotent(xs):
    assert sorted(sorted(xs)) == sorted(xs)

@given(st.lists(st.integers()))
def test_sort_is_monotonic(xs):
    s = sorted(xs)
    for a, b in zip(s, s[1:]):
        assert a <= b

@given(st.lists(st.integers()))
def test_sort_preserves_elements(xs):
    assert sorted(sorted(xs)) == sorted(xs)
    assert sorted(xs, reverse=True)[::-1] == sorted(xs)
```

Hypothesis generates hundreds of lists — empty, single-element, negative numbers, huge, sorted, reversed. Every invariant holds, or Hypothesis finds a minimal counterexample.

### Useful invariants to look for

- **Round-trip** — `parse(serialize(x)) == x`, or `decrypt(encrypt(x)) == x`.
- **Idempotence** — `f(f(x)) == f(x)`.
- **Inverse** — `inverse(f(x)) == x`.
- **Algebraic properties** — `add(a, b) == add(b, a)` (commutativity), `(a + b) + c == a + (b + c)` (associativity).
- **Monotonicity** — adding an element never decreases the output.
- **Invariance** — a property holds no matter the input.
- **Metamorphic relations** — `f(scale(x, 2)) == scale(f(x), 2)`.

### Shrinking — the killer feature

When a property fails, PBT tools **shrink** the counterexample to a minimal failing case. You don't get "list of 94 floats of which five are subtly wrong"; you get "[-1.0, 0.0]" with a clear trace.

Hypothesis is exceptional at this. A rule that fails because of integer overflow on a single specific value will shrink to that value in seconds.

### Frameworks by language

| Language | Framework |
| --- | --- |
| Python | [Hypothesis](https://hypothesis.readthedocs.io/) |
| JavaScript / TypeScript | [fast-check](https://fast-check.dev/) |
| Go | [Gopter](https://github.com/leanovate/gopter), built-in `testing/quick` |
| Haskell | [QuickCheck](https://hackage.haskell.org/package/QuickCheck) — the original |
| Rust | [proptest](https://docs.rs/proptest/) |
| Erlang | [PropEr](https://proper-testing.github.io/) |
| Elixir | [StreamData](https://hexdocs.pm/stream_data/) |
| Ruby | [Rantly](https://github.com/rantly-rb/rantly) — less active |
| Java / Kotlin | [jqwik](https://jqwik.net/) |

### Hypothesis example — the real juice

Testing a rate limiter:

```python
from hypothesis import given, strategies as st
from hypothesis.stateful import RuleBasedStateMachine, rule, invariant

class RateLimiterMachine(RuleBasedStateMachine):
    def __init__(self):
        super().__init__()
        self.limiter = RateLimiter(max_per_minute=10, clock=FakeClock())
        self.allowed_count = 0

    @rule(key=st.sampled_from(["u1", "u2", "u3"]))
    def try_allow(self, key):
        if self.limiter.allow(key):
            self.allowed_count += 1

    @rule(seconds=st.integers(min_value=1, max_value=120))
    def advance_clock(self, seconds):
        self.limiter.clock.advance(seconds)

    @invariant()
    def per_key_limit_not_exceeded(self):
        for key in ["u1", "u2", "u3"]:
            assert len(self.limiter.hits[key]) <= 10

TestRateLimiter = RateLimiterMachine.TestCase
```

Hypothesis runs thousands of interleaved `try_allow` / `advance_clock` sequences, and if any sequence violates the invariant, it shrinks to the minimal failure. Stateful PBT is the big value multiplier.

### When PBT is worth it

- Parsers, serializers, codecs.
- Algorithms with provable invariants (sorting, hashing, shuffling).
- State machines.
- Any code where "works on every example I thought of" isn't a strong statement.

### When it isn't

- UI code with visual outputs.
- Code tightly coupled to specific API responses.
- Code with huge state spaces and no clear invariants.

## Coverage-guided fuzzing

Different beast. CGF feeds bytes into a function, mutates based on coverage feedback, and runs for hours or days:

```go
// fuzz_parse.go
func FuzzParse(f *testing.F) {
    f.Add([]byte("valid-example"))
    f.Fuzz(func(t *testing.T, data []byte) {
        parsed, err := Parse(data)
        if err != nil {
            return
        }
        reserialized := parsed.Serialize()
        roundtripped, err := Parse(reserialized)
        if err != nil {
            t.Fatalf("round-trip failed: %v", err)
        }
        if !reflect.DeepEqual(parsed, roundtripped) {
            t.Fatalf("round-trip mismatch: %v != %v", parsed, roundtripped)
        }
    })
}
```

Run:

```bash
go test -fuzz=FuzzParse -fuzztime=10m
```

The fuzzer maintains a **corpus** — inputs that reached new code paths. Over time the corpus grows to cover most of the reachable state.

### Tools

- **[AFL++](https://github.com/AFLplusplus/AFLplusplus)** — the canonical CGF for C/C++.
- **[libFuzzer](https://llvm.org/docs/LibFuzzer.html)** — built into LLVM, used heavily by Chrome.
- **[Go's built-in fuzzer](https://go.dev/security/fuzz/)** — since Go 1.18; shown above.
- **[Atheris](https://github.com/google/atheris)** — libFuzzer bindings for Python.
- **[Jazzer](https://github.com/CodeIntelligenceTesting/jazzer)** — JVM fuzzer.
- **[cargo-fuzz](https://rust-fuzz.github.io/book/cargo-fuzz.html)** — Rust via libFuzzer.

### What CGF finds

- Memory corruption (buffer overflows, use-after-free) — primarily in unsafe languages.
- Logic crashes — unhandled exceptions, panics, assertions.
- Parser bugs — inputs that loop forever, recurse too deep, blow the stack.
- Differential bugs — two implementations that should agree, don't.

### OSS-Fuzz

Google's **[OSS-Fuzz](https://github.com/google/oss-fuzz)** is a free continuous-fuzzing service for open-source projects. It runs your fuzz targets on Google's infra, files bugs automatically, and has found 30,000+ bugs in major OSS projects.

If you maintain an OSS library with parseable input, onboard to OSS-Fuzz. The ROI is enormous.

## Differential fuzzing

A specific style: feed the same input to two implementations and check they agree. Used for:

- Compiler / interpreter testing (LLVM's various passes, JS engines).
- Cryptographic libraries (two implementations of AES).
- Protocol implementations (BoringSSL vs OpenSSL).

Whenever two teams implement the same spec, differential fuzzing finds spec ambiguities and implementation bugs with stunning efficiency.

## LLM-assisted corpus generation

A 2023+ development: feeding a codebase to an LLM and asking it to generate plausible inputs, which then seed a fuzzer. Google's **OSS-Fuzz-Gen** uses this to bootstrap fuzz harnesses for projects that had none.

The LLM isn't the fuzzer. It's the creator of good seed inputs — the hardest human-effort step in fuzzing. CGF + LLM seeds is the current frontier.

## Common mistakes

- **Testing only happy paths.** The first PBT every project adds should test error handling: "every invalid input either throws a known exception or returns a specific error; nothing else."
- **Examples disguised as properties.** `@given(st.integers(min_value=0, max_value=10))` — ten inputs isn't a fuzz test. Widen the strategy.
- **Time-based properties without a fake clock.** A test that asserts "X happened within 100ms" fails under CI load. Inject the clock.
- **Ignoring flaky PBT failures.** Hypothesis found a real bug; you retry and the test passes because the generator chose a different input. Save the seed (Hypothesis does this automatically) and reproduce.
- **Running CGF for 30 seconds.** CGF needs hours to days. Either run it continuously (OSS-Fuzz) or budget CI for serious time.
- **Not versioning the corpus.** CGF corpora evolve; keeping them in a shared storage lets the team benefit from prior runs.
- **Overly-constrained generators.** A strategy like `st.text(alphabet="abc")` finds fewer bugs than `st.text()`. Start wide; narrow only when the test logic genuinely requires it.

## Integrating into CI

- **PBT** — run as part of the regular test suite. Fast; < 10 seconds for most properties.
- **Short fuzz runs** — 60 seconds per target in CI, as a regression gate.
- **Long fuzz runs** — on a nightly or weekly job, hours per target.
- **Corpus** — check in seeds; keep the evolving corpus in cache or object storage.

## Complementary, not replacement

Fuzz tests don't replace:

- [Unit tests](../unit-tests/) — specific behaviors you care about.
- [Component tests](../component-tests/) — UI behavior the fuzzer can't reason about.
- [Integration tests](../integration-tests/) — cross-component interactions.

A good property complements them. A test suite with only PBT has no specific-example assertions; a test suite with only examples misses edge cases. Layer both.

## References

- [Hypothesis documentation](https://hypothesis.readthedocs.io/)
- [fast-check documentation](https://fast-check.dev/)
- [QuickCheck — Koen Claessen, John Hughes, 2000](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf) — the paper
- [OSS-Fuzz](https://github.com/google/oss-fuzz) — Google's continuous fuzzing for OSS
- [Go Fuzzing tutorial](https://go.dev/doc/tutorial/fuzz)
- [Fuzzing Book — Zeller, Gopinath, et al.](https://www.fuzzingbook.org/) — comprehensive free online book
- [David MacIver — *How to specify it!*](https://www.youtube.com/watch?v=G0NUOst-53U) — John Hughes talk on property design

## Related topics

- [Unit tests](../unit-tests/) — the example-based counterpart
- [Integration tests](../integration-tests/) — where differential fuzzing often lives
- [TDD](../tdd/) — property-based TDD is a fringe but effective practice
