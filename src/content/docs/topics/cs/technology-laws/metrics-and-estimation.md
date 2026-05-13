---
title: "Metrics and estimation: Goodhart's Law, Pareto Principle, Hofstadter's Law, the 90-90 Rule, and Parkinson's Law"
description: "Five laws that explain why software metrics rot, estimates are always wrong, and deadlines fill with work."
parent: technology-laws
tags: [engineering-management, metrics, estimation, productivity]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

## Goodhart's Law

Origin: Charles Goodhart, 1975, in the context of UK monetary policy. Popularized in software by Marilyn Strathern's reformulation.

> When a measure becomes a target, it ceases to be a good measure.

Goodhart's original statement was about economic indicators: if the central bank targets M3 money supply, banks will game M3. Strathern sharpened it into the form engineers use: any metric you optimize for as a target stops telling you what you wanted to know.

**In-depth example 1: Story points and velocity theater.** A team measures velocity (story points completed per sprint). Management starts using velocity as a performance metric. Within two quarters, estimates inflate. "Small" features become "medium." The team's average estimate per task drifts up 40%. Velocity looks healthy. Actual output is flat. The story points that were once a useful planning tool now measure how well the team inflates story points.

**In-depth example 2: Code coverage as a target.** A team is told to hit 80% code coverage. They do. They write tests that execute the code without asserting anything meaningful: empty test bodies, `assert True`. Coverage is 80%. Bugs ship. Coverage was a useful signal when it was a consequence of good testing. It became useless the moment hitting 80% became the goal.

**In-depth example 3: Bugs-closed-per-week.** An engineering org tracks "bugs closed per week" as a health metric. Engineers start closing bugs by marking them as "won't fix" or "duplicate" rather than resolving them. They reopen bugs in the next week's backlog and close them again. The number looks good. The bug backlog doesn't shrink. The metric that was supposed to measure progress is now measuring creative accounting.

**In-depth example 4: Lines of code.** "Lines of code produced" has been used as a productivity proxy. The result is verbose code. Developers avoid refactoring that reduces line count. Functions that could be 3 lines become 15. Fewer lines written equals punishment. More lines written equals reward. The metric optimizes for the opposite of good software craftsmanship.

**What Goodhart's Law means for engineering metrics.** Metrics are useful for understanding: looking at velocity over time, observing trends, spotting anomalies. They become dangerous the moment they are targets that individuals are evaluated against. The fix is not to stop measuring. It's to keep metrics as diagnostic tools, not incentive structures.

---

## The Pareto Principle

Origin: Vilfredo Pareto, 1896, observing that 80% of Italy's land was owned by 20% of the population. Applied to software quality by Joseph Juran in the 1940s.

> Roughly 80% of effects come from 20% of causes.

The specific numbers (80/20) are not the point. The point is that distributions in complex systems are radically non-uniform. A small fraction of inputs drives a large fraction of outputs.

**In-depth example 1: Bug concentration.** The classic software application. Microsoft's research found that fixing the top 20% of most-reported bugs eliminated 80% of related errors and crashes. The implication for QA: exhaustive testing across all code is less effective than deep testing of the 20% that matters most. Identifying which 20% requires profiling and crash data, not intuition.

**In-depth example 2: Feature usage.** A product team adds 20 features in a year. User analytics show that 4 of them account for 80% of time spent in the product. The other 16 features are used rarely or never. The features that drove 80% of usage represent 20% of the engineering investment. The implication: ruthless feature prioritization outperforms broad-based feature development.

**In-depth example 3: Database query performance.** 80% of database time is consumed by 20% of queries. Identify those queries with slow query logs, add the right indexes, and performance improves dramatically. Indexing every column uniformly is wasteful. Run EXPLAIN ANALYZE on the heavy queries, fix those 20%, and you address 80% of the performance problem.

**In-depth example 4: On-call incidents.** 80% of PagerDuty alerts come from 20% of services. Fixing those services' alerting thresholds, stability issues, or deployment frequency reduces alert fatigue dramatically. The other 80% of services make noise but account for relatively little actual on-call burden.

**How to use it.** Don't treat this as a precise formula. Use it as a prior. Before deciding where to invest effort, ask: which 20% of the problem space drives 80% of the impact? In performance work, in testing, in product development, in incident reduction, the non-uniform distribution is almost always there.

---

## Hofstadter's Law

Origin: Douglas Hofstadter, "Gödel, Escher, Bach: An Eternal Golden Braid," 1979.

> It always takes longer than you expect, even when you take into account Hofstadter's Law.

The self-referential recursion is the entire point. You already know projects take longer than estimated. You try to compensate by padding. The padded estimate still ends up too short. The law accounts for the compensation and says it doesn't matter.

**In-depth example 1: The recursive estimate.** A developer estimates 2 weeks for a feature. They've read Hofstadter's Law. They double their estimate: 4 weeks. They ship in 7 weeks. Next time, they triple the estimate. The project takes even longer than the tripled estimate. The bias is not a simple multiplier. It is systematic and correlated with complexity. The things most likely to be underestimated are the things you don't know you don't know. Adding a constant multiplier does not help because the unknown unknowns are, by definition, outside the scope of your estimate.

**In-depth example 2: The 2-week prototype.** A team demos a prototype in week 2 and announces "it's 80% done, just a few more tweaks." The tweaks take 6 weeks. The last 20% involves: error handling, edge cases, performance under real data volumes, integration with the actual auth system, mobile responsiveness, accessibility, ops tooling for deployment, and a requirements clarification meeting that adds two new features. Hofstadter's Law predicts this. The prototype showed the happy path. The remaining 20% of visible functionality conceals 80% of the actual work.

**Why estimation is hard, structurally.** Software estimation fails for a specific reason. The tasks you can estimate accurately are the ones you've done before. Novel tasks, by definition, are ones you haven't done before. The variance in duration for novel tasks is high. Software projects are almost always a mix of familiar and novel, and the novel parts dominate the schedule risk.

**Reference class forecasting as the partial solution.** Instead of estimating from first principles ("how long will this take?"), estimate from historical data ("how long did similar projects take?"). Kahneman calls this taking the "outside view." It partially addresses Hofstadter's Law because the historical data already contains all the unknown unknowns that sank similar projects. It doesn't fully solve the problem (the current project may have unique unknowns), but it produces less overconfident estimates.

---

## The Ninety-Ninety Rule

Origin: Tom Cargill, Bell Labs. First appeared in print in Jon Bentley's "Programming Pearls" column, 1985.

> The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent of the development time.

The joke is the arithmetic: 90 + 90 = 180% of the time. The observation is that "90% done" is not a useful statement.

**In-depth example 1: The happy path is not the product.** A developer finishes the main flow of a feature in the first week and reports "basically done, just finishing up." The remaining work includes: input validation for every edge case, error messages that are readable to non-engineers, loading states and skeleton screens, mobile layout for narrow viewports, graceful degradation when the backend is slow, an audit log entry for compliance, logging that the monitoring team needs, documentation, a feature flag so it can be deployed without activating, and a migration that handles the two dozen existing records that don't fit the new data model. This is the second 90%.

**In-depth example 2: "We're 90% done" in a sprint.** "90% done" is a signal that a task is in its dangerous zone. It's the point where all the clean work is finished and only the messy work remains. The hardest bugs are found in the last 10%. The last integration with the system is always the hardest. Treating "90% done" as "almost done" is the planning error. It's more accurate to treat it as "the easy part is finished."

**In-depth example 3: The rewrite that never ships.** A team decides to rewrite a legacy system from scratch. The new system reaches "90% feature parity" after 6 months. The last 10% takes 18 more months: edge cases from years of production use, integrations with a dozen internal systems, performance under actual traffic patterns, compliance requirements discovered during legal review, and every quirk that was undocumented in the original but that downstream systems silently depended on. This is Hyrum's Law (undocumented behavior becomes contract) colliding with the Ninety-Ninety Rule.

---

## Parkinson's Law

Origin: C. Northcote Parkinson, "Parkinson's Law," The Economist, 1955.

> Work expands so as to fill the time available for its completion.

Parkinson was writing about British civil service bureaucracy, but the observation maps directly to software.

**In-depth example 1: The padded sprint.** A developer can complete a task in 2 days. The sprint is 2 weeks. The developer estimates 3 days (realistic padding). The task takes 3 days. Had the sprint been 3 days long, the task would have taken 2 days. The additional time was not idle. It was filled with polishing, rethinking, and scope creep that seemed reasonable at the time.

**In-depth example 2: The 6-week runway problem.** A startup has 6 weeks of runway. They ship in 5 weeks. The same startup with 6 months of runway for the same product takes 5 months. The work is not fundamentally different. The time horizon shapes how much work there is to do. With 6 months, there are planning meetings, documentation, refactors, architecture discussions. With 6 weeks, there is shipping.

**In-depth example 3: The deadline as a forcing function.** "Hard" deadlines (those with real consequences for slipping) reliably produce on-time delivery in ways that "soft" deadlines (those that can be renegotiated) do not. The asymmetry is Parkinson's Law: in the absence of a hard constraint, the available time is consumed. Imposing an artificial hard constraint changes behavior. This is the mechanism behind time-boxed sprints. The box is artificial, but it works.

**Parkinson's Law combined with Hofstadter's.** Hofstadter says you'll underestimate. Parkinson says the time you allocate will be consumed regardless. Together they explain the scheduling paradox: tasks always take approximately the time they were allocated, but the allocated time was underestimated to begin with, so projects are always late.

---

## References

- Goodhart, C. (1975). "Problems of Monetary Management: The UK Experience." Papers in Monetary Economics.
- Strathern, M. (1997). "'Improving ratings': audit in the British University system." European Review, 5(3).
- Juran, J.M. (1951). *Quality Control Handbook*. McGraw-Hill.
- Hofstadter, D. (1979). *Gödel, Escher, Bach*. Basic Books.
- Bentley, J. (1985). "Programming Pearls." Communications of the ACM, 28(9).
- Parkinson, C.N. (1955). "Parkinson's Law." The Economist.

## Related topics

- [`./team-dynamics/`](./team-dynamics/) -- Brooks's Law (deadline pressure and team size)
- [`./performance-math/`](./performance-math/) -- quantitative tools for reasoning about system behavior
- [`../../../testing/tdd/`](../../../testing/tdd/) -- test-driven development as a forcing function against over-engineering
