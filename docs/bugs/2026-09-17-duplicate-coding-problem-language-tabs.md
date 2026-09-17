# Duplicate coding-problem language tabs

Status: Fixed on 2026-09-17.

## Impact

Twenty-four completed approach panels across 16 coding-problem pages rendered two Python tabs. The first tab loaded the generic exercise starter, so it displayed the starter-code note and intentional TODOs where readers expected a completed implementation. Some pairs also reused the same runner ID.

## Cause

The regression formed across two commits:

1. Commit 5559230 added TypeScript tabs across the catalog on 2026-05-13. Several new "Try this approach" panels reused practiceCode as their Python source.
2. Commit 53def83 auto-wired missing approach files on 2026-05-15. Its fix_approach_stubs.py script inserted an approach-specific Python tab before the TypeScript tab, but it did not inspect or replace an existing Python tab.

The source test added with 53def83 checked whether each approach file name appeared in its MDX page. It did not check tab-label uniqueness, runner-ID uniqueness, or whether a completed approach still loaded a generic starter. The MDX remained valid, and Starlight rendered both tabs, so builds stayed green.

The later starter-code banner made the older content-model error visible. The banner was accurate for practiceCode. The approach panel was using the wrong source.

## Resolution

The 24 generic starter tabs were removed. Each affected panel now keeps the completed approach-specific Python runner alongside its TypeScript, Go, and static Swift variants.

npm run validate:code-examples now scans every coding-problem MDX file and rejects:

- Repeated language labels inside one Tabs group.
- Duplicate REPL IDs within one page.
- Generic practiceCode runners inside completed Approach sections.

Unit coverage lives in tests/coding-problem-tab-contracts.test.mjs, and the test runs in the default pre-push workflow.

## Authoring rule

Automation that wires an approach implementation inspects the whole target tab group. It replaces a placeholder for that language or stops with an error. It never inserts a second language tab beside an existing one.

Evidence: commits 5559230 and 53def83, src/lib/coding-problem-tab-contracts.mjs, scripts/validate-code-examples.mjs, tests/coding-problem-tab-contracts.test.mjs.
