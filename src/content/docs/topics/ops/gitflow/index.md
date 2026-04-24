---
title: Gitflow
description: Vincent Driessen's 2010 branching model. Five branch types, prescriptive merge rules, versioned releases. What it gets right, why most modern teams don't use it, and the alternatives that replaced it.
category: ops
tags: [git, gitflow, branching, workflows, versioning]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What Gitflow is

[Gitflow](https://nvie.com/posts/a-successful-git-branching-model/), introduced by Vincent Driessen in January 2010, is a prescriptive branching model with five branch types and strict rules for how they interact. For a decade it was the default answer to "how should we branch?", partly because it was the first well-written answer.

It's out of favor now, but the patterns it formalized, separation of release and integration, hotfix branches, versioned releases, still shape real-world workflows. Worth understanding both for legacy codebases and for the decision of when *not* to use it.

Driessen himself added a note to his own post in 2020: if you're building a SaaS product with continuous delivery, use something simpler. Gitflow still fits versioned, multi-release, explicitly-shipped software.

## The five branch types

```
            feature/*            release/*
              │                    │
              ▼                    ▼
        ┌─────────┐           ┌─────────┐
develop │         │──merge───►│         │──merge─┐
        └─────────┘           └─────────┘        │
              ▲                                  ▼
              │                             ┌─────────┐
              └──merge────────main──────────┤         │
                                            └─────────┘
                                                  ▲
                                                  │
                                              hotfix/*
```

### `main` (historically `master`)

The branch that reflects what's in production. Only merges from `release/*` and `hotfix/*`. Every commit on `main` is tagged with a version (e.g. `v1.4.2`).

### `develop`

The integration branch. All feature work merges here. Between releases, `develop` is where the next version takes shape. Never merged to `main` directly, always goes through a `release/*` branch first.

### `feature/<name>`

Branched from `develop`. Used for a single new feature. Merged back to `develop` when done (via `--no-ff` merge, per the original post, to preserve the feature as a grouped history). Never touches `main`.

### `release/<version>`

Branched from `develop` when the team is ready to cut a release. Used for release-prep work: version bumps, last-minute bug fixes, docs tweaks. No new features. When ready, merged to both `main` (tagged with the version) and back to `develop` (so fixes aren't lost).

### `hotfix/<version>`

Branched from `main` (not `develop`) when production is broken. Used to fix urgent bugs without waiting for the next release cycle. Merged to `main` (tagged) and to `develop`. The "urgent production bug" lane.

## The merge rules

The rules are what make Gitflow, well, Gitflow. Skip one and the whole thing drifts:

1. Feature branches merge only to `develop`.
2. Release branches merge to both `main` and `develop`.
3. Hotfix branches merge to both `main` and `develop`.
4. `main` only receives merges from `release/*` and `hotfix/*`.
5. Every merge to `main` is tagged.
6. Use `--no-ff` (no fast-forward) for all merges, so the branch topology is preserved in the history.

## When Gitflow still fits

The original post was written for **versioned software with discrete releases**. If your product looks like:

- Desktop software with numbered versions ("1.7.3 is out")
- Mobile apps that go through app-store review before users get them
- Libraries and packages with a semver contract
- Enterprise software delivered as installers or long-support releases
- Firmware or embedded systems

…then Gitflow's separation of integration (`develop`) and shipped code (`main`), plus hotfix lanes, maps cleanly onto reality. You have releases. You need to ship point-fixes against the currently-released version while concurrent feature work happens. That's exactly the problem Gitflow solves.

## When it doesn't fit

The problems start when you apply Gitflow to **continuous delivery**.

- **A long-lived `develop` branch diverges from `main`.** Merges get painful. Hotfixes made on `main` need to be merged back, and conflicts pile up.
- **Features sit on branches for days or weeks.** Integration problems surface at merge time instead of continuously.
- **The release branch is ceremonial.** A five-minute branch to "prep the release" adds cognitive overhead without value if you're releasing multiple times a day.
- **`--no-ff` merges produce a dense, bubble-heavy history** that's hard to read.
- **Hotfixes can't easily cherry-pick through.** If `main` and `develop` have diverged, a hotfix that lands on `main` may not merge cleanly to `develop`.

Continuous delivery doesn't want an integration branch. It wants *the* branch to be shippable at all times. Gitflow's model assumes releases are events; CD assumes they're non-events.

## The alternatives

### GitHub Flow

Introduced by GitHub in 2011. One long-lived branch (`main`), everything branches from and merges to it. Every merge is a release.

```
main ──●──────●──────●──────●
        \    /\    /\    /
         \──/  \──/  \──/
         feature  feature  feature
```

- Branch from `main`.
- Push early, open a PR.
- Review, iterate.
- Merge to `main`. Deploy.

No `develop`, no release branches, no hotfix branches. Every change either ships or it's incomplete. This is the dominant open-source and SaaS pattern today.

### Trunk-based development

A stricter relative of GitHub Flow. Short-lived branches (under a day), feature flags for partial work, all-but-merged work behind flags in trunk. Championed by [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/).

- Commits go to trunk almost immediately.
- In-progress features hide behind feature flags.
- Release branches (if used) are very short-lived, cut, ship, discard.
- Favors small changes, aggressive CI, and feature-flag infrastructure.

This is how high-volume teams (Google, Amazon SRE org, stripes of Facebook) operate.

### GitLab Flow

A middle ground: short-lived feature branches merged to `main`, plus optional per-environment branches (`production`, `staging`) that track what's currently deployed. A commit ships to staging on merge to `main`; promotion to `production` is a merge from `main` to `production`.

Borrows from Gitflow (environment branches) and GitHub Flow (short-lived features).

### Release Flow (Microsoft)

Used inside Azure DevOps. Short-lived topic branches merged to `main` via PR. Release branches cut off `main` for each release, but kept in the codebase only until the next release. Hotfixes branch off the release branch and cherry-pick back.

## A decision tree

```
                ┌─ Are you shipping versioned releases (semver, store review, installers)?
                │
        ┌───────┤
        │       │
        ▼       ▼
       Yes      No
        │       │
        │       ▼
        │   ┌─ Do you deploy multiple times per day?
        │   │
        │   ├── Yes ────► Trunk-based development
        │   └── No  ────► GitHub Flow
        │
        ▼
    ┌─ Do you have multiple concurrent release versions in support?
    │
    ├── Yes ──► Gitflow (or a release-per-version variant)
    └── No  ──► Release Flow or lightweight Gitflow
```

## Semver, tags, and why they outlive any branching model

Regardless of workflow, two conventions almost always survive:

- **Tags on `main`** (or the equivalent) mark releases. `v1.4.2`, `v2.0.0-beta.1`. Tags are immutable pointers to the commit that shipped.
- **[Semantic versioning](https://semver.org/)**, `MAJOR.MINOR.PATCH`. Major for breaking, minor for additive, patch for fixes. Tooling (npm, pip, cargo) depends on it.

Gitflow enforces tagging at `main` merges; GitHub Flow often leaves it implicit. Either way, tag your releases. Rollback, bisection, and changelog generation all depend on them.

## The `git-flow` CLI tool

There's an actual command-line tool, `git-flow` or `git-flow-avh`, that wraps the workflow:

```bash
git flow init                        # sets up develop, main, conventions
git flow feature start my-feature    # creates feature/my-feature from develop
git flow feature finish my-feature   # merges to develop with --no-ff, deletes branch
git flow release start 1.2.0         # creates release/1.2.0 from develop
git flow release finish 1.2.0        # merges to main + develop, tags, deletes branch
git flow hotfix start 1.1.1          # creates hotfix/1.1.1 from main
git flow hotfix finish 1.1.1         # merges to main + develop, tags, deletes branch
```

Useful if you're committed to Gitflow; otherwise, the raw Git commands are more flexible.

## Practical patterns you can steal even without Gitflow

Even if you don't adopt Gitflow wholesale, these patterns from it are genuinely useful:

- **A "ship" branch separate from `main`.** Some teams use `prod` or `production` to track deployed state, with `main` as integration. Clean separation without the `develop` ceremony.
- **Hotfix lanes.** A named pattern (`hotfix/*` or a PR label) for urgent fixes that skip the normal review depth. Make the exception explicit.
- **Tagged releases on `main`.** Every deploy gets a tag. Bisection and rollback both need this.
- **`--no-ff` for long-lived features.** Preserves the history of *why* a chunk of commits exists. Worth it on features that span a few days; overkill for single-commit PRs.
- **Release branches for supported versions.** If you ship `v1.x` and `v2.x` concurrently, a persistent `release/1.x` branch is how bugfixes stay isolated from `v2.x` changes.

## Common mistakes (across workflows)

- **Long-lived feature branches in any model.** The branch diverges from the integration point; the merge gets ugly. Keep features under a week.
- **Merging `develop` into `main` directly.** Skips the release-branch buffer; suddenly `main` has unreleased changes. In Gitflow, always go through a `release/*`.
- **Hotfixes that aren't merged back.** The fix lands on `main`, nobody merges it to `develop`, the bug reappears in the next release. Hotfixes always merge both directions.
- **Trunk-based without feature flags.** Small branches + direct-to-trunk + no flags = broken trunk. The flags are load-bearing.
- **Rebasing shared branches.** `main` and `develop` are never rebased. Feature branches can be, if you own them solo.
- **Squashing when the history matters.** Squashing losses the narrative of how a change was developed. For exploration or review iterations, squash is fine; for cross-team features, preserve the history.

## The cultural reality

The "right" branching model correlates with how your team deploys:

- **Ship when ready, daily+:** Trunk-based or GitHub Flow. Gitflow fights you.
- **Ship on a schedule, every 1–4 weeks:** GitHub Flow with tagged releases, or lightweight Gitflow.
- **Ship rarely (months), with multiple supported versions:** Gitflow. This is its natural habitat.

Pick the one that matches your release cadence, not the one the internet says is "modern." A team that ships once a quarter using trunk-based will invent worse versions of release branches from scratch. A team that ships ten times a day using Gitflow will drown in merges.

## References

- [A successful Git branching model, Vincent Driessen, 2010](https://nvie.com/posts/a-successful-git-branching-model/), the original post, plus the 2020 update saying "use something simpler for SaaS"
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow), the simplest alternative
- [Trunk-Based Development](https://trunkbaseddevelopment.com/), Paul Hammant's reference site for the strictest alternative
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html), environment-branches variant
- [Microsoft Release Flow](https://devblogs.microsoft.com/devops/release-flow-how-we-do-branching-on-the-vsts-team/), what Azure DevOps uses
- [Semantic Versioning](https://semver.org/), the versioning standard that pairs with any of the above
- [git-flow CLI, `git-flow-avh`](https://github.com/petervanderdoes/gitflow-avh), the maintained CLI wrapper

## Related topics

- [GitOps](../gitops/), branching strategy's downstream sibling
- [ArgoCD](../argocd/), deployment tooling that can work with any branch model
- [Django Part 10, Production](../../web/django/part-10-production/), where branches become actual deploys
