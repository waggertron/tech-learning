---
title: SOC 2 for software engineers, what the audit actually checks
description: Five Trust Service Criteria, Type 1 vs Type 2, Common Criteria, and the gap between what an auditor needs to see and what security actually looks like. A walkthrough for engineers at a company going through the motions.
date: 2026-04-24
tags: [soc2, compliance, security, audits, b2b-saas]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-soc-2-for-software-engineers/
---

## What SOC 2 is (and isn't)

**SOC 2**, Service Organization Control 2, is an audit framework from the AICPA (the US accounting standards body). It's the compliance artifact most B2B SaaS enterprise buyers demand before they sign a contract. Every year around renewal time, a CPA firm audits your company and issues a report.

It is **not**:

- A certification. There's no "SOC 2 certified" badge. There's a **report**, issued by an audit firm, that says "these controls existed and operated."
- A security standard. SOC 2 doesn't tell you *how* to be secure. It tells you to pick controls, document them, and prove they work.
- A government regulation. No one enforces it. It's a private-sector trust artifact.
- A one-time project. Type 2 reports require a continuous observation period (usually 6–12 months).
- Proof you're unhackable. Plenty of SOC 2'd companies have been breached.

It **is** the price of admission for selling software to mid-market and enterprise companies. And it does, at minimum, force you to write down what you do and follow it.

## The five Trust Service Criteria (TSC)

SOC 2 is organized around five categories. You pick which ones apply; every audit covers **Security** (the "Common Criteria"); the other four are optional.

| Criterion | What it covers | When you scope it in |
| --- | --- | --- |
| **Security** (required) | Access controls, change mgmt, encryption, logging, incident response | Always |
| **Availability** | Uptime commitments, DR, capacity planning | If you sell an SLA |
| **Processing Integrity** | Data is processed completely and accurately | Financial/billing systems |
| **Confidentiality** | Data marked confidential stays confidential | Most B2B deals need this |
| **Privacy** | Personal information handling per your privacy notice | Consumer products, PII-heavy |

Most Series A SaaS companies scope **Security + Availability + Confidentiality**. Privacy adds significant process weight (notice, consent, subject access requests) and isn't worth it unless you're specifically B2C.

## Type 1 vs Type 2

- **Type 1**, "these controls *existed* on this date." A point-in-time snapshot. Faster, cheaper, but buyers barely look at it anymore.
- **Type 2**, "these controls *operated effectively* over this period (usually 6–12 months)." The real artifact. This is what enterprise procurement wants.

Path for most startups: Type 1 in Q1, Type 2 covering the following 6–12 months. After the first Type 2, you renew annually.

## What the auditor actually checks

The Common Criteria (CC-series) has ~60 criteria grouped into nine areas:

- **CC1**, control environment (org structure, ethics, HR hiring/termination)
- **CC2**, communication and information (internal comms, vendor comms)
- **CC3**, risk assessment (risk register, threat modeling)
- **CC4**, monitoring activities (internal audit, continuous monitoring)
- **CC5**, control activities (the actual technical controls)
- **CC6**, logical and physical access
- **CC7**, system operations (incident response, change management)
- **CC8**, change management
- **CC9**, risk mitigation (vendor risk, insurance)

You don't implement each criterion as a line-item. You implement **controls** that cover one or more criteria, document them, and the auditor maps your controls to the criteria.

## The evidence auditors want (by area)

This is where engineering actually shows up. For a typical B2B SaaS company:

### Access management

- **SSO everywhere.** Engineering laptops, cloud consoles, GitHub, Slack, Jira. Auditor will ask for the list of critical systems and verify SSO.
- **MFA on SSO and privileged accounts.** TOTP or WebAuthn; SMS doesn't count for anything sensitive.
- **Quarterly access reviews.** Someone reviews "who has access to what" and signs off. Must be logged; auditor will ask for a sample.
- **Onboarding / offboarding checklists.** Termination especially, within 24 hours, ideally automated.
- **Least privilege in cloud.** IAM roles, no account-wide `*:*` for humans.

### Change management

- **All code changes via pull request.** No direct pushes to `main`.
- **Required reviewers.** Branch protection rule enforced, not just documented.
- **CI runs tests.** Auditor doesn't care what tests; they care that builds block on failure.
- **Production deploys from CI, not laptops.** Paper trail from PR → merge → deploy.
- **Emergency change policy.** Written procedure for production hotfixes when full review isn't possible. Auditors love this one because it acknowledges reality.

### Logging and monitoring

- **Centralized logs.** CloudWatch, Datadog, Splunk, one of these. With retention (usually 12 months minimum).
- **Alerts on security events.** Failed logins, IAM policy changes, public S3 bucket creation.
- **Log integrity.** Logs are write-only from the source; engineers can't delete them.
- **Runbook for each alert.** "When X fires, do Y." Auditors verify the runbook is followed in a sample incident.

### Incident response

- **Written IR plan.** Who's on call, escalation paths, communication templates.
- **Annual tabletop exercise.** Run through a hypothetical incident, document what happened.
- **Post-incident reviews (blameless).** One per incident. Auditor samples a few and reads them.

### Vendor management

- **A list of all vendors** that process customer data or are critical to ops.
- **SOC 2 reports on file** from every vendor that has one. For ones that don't, a risk assessment explaining why you still use them.
- **Annual review** of the vendor list.

### Encryption

- **In transit.** TLS everywhere, including internal service-to-service. mTLS in some audits.
- **At rest.** EBS / RDS / S3 encryption on. KMS or equivalent.
- **Key management.** Keys rotated; access to keys limited.
- **Secrets.** Not in source. Secrets manager + rotation for long-lived credentials.

### Vulnerability management

- **Dependency scanning.** Dependabot, Snyk, or similar. Critical CVEs patched within a defined SLA (often 30 days).
- **Container scanning** for image CVEs.
- **Penetration test annually.** Third-party pen test, with results + remediations tracked.

### Business continuity

- **Backup policy.** RDS automated backups, S3 versioning, PVC snapshots.
- **Restore drill.** Actually restore from backup annually. Document the result.
- **DR plan.** Multi-AZ minimum; multi-region if the availability criterion is in scope.

## The unglamorous 80%, documentation

Most of a SOC 2 audit isn't about fancy security. It's about:

- Does the policy exist?
- Does the policy describe what actually happens?
- Is there evidence the policy was followed?

The gap between "we have 2FA" and "we have a written Access Control Policy, updated in the last year, that mandates 2FA, and we can show an audit log of every user login proving 2FA was used" is the gap SOC 2 forces you to close.

Typical document set:

- Information Security Policy
- Access Control Policy
- Change Management Policy
- Incident Response Plan
- Business Continuity Plan
- Vendor Management Policy
- Risk Management Policy
- Data Classification Policy
- Acceptable Use Policy
- Secure SDLC Policy

Each ~5–15 pages, approved by someone with authority (usually the CTO or CISO), reviewed annually. Template packs are available from every compliance automation vendor.

## Compliance automation platforms

The modern path is a SaaS tool that aggregates evidence, tracks controls, and runs continuous monitoring:

| Tool | Notes |
| --- | --- |
| [Vanta](https://www.vanta.com/) | Largest, well-known, integrations-heavy |
| [Drata](https://drata.com/) | Strong UI, faster auditor portal |
| [Secureframe](https://secureframe.com/) | Similar tier to Drata |
| [Thoropass](https://thoropass.com/) | Combines audit firm + automation, one vendor |
| [Oneleet](https://www.oneleet.com/) | Newer entrant; security-focused |

They plug into AWS, GitHub, Okta, Google Workspace, etc., pull evidence continuously, and flag control gaps. They reduce audit prep from months to weeks.

You still need a human auditor to issue the report. Common SOC 2 auditors: **Prescient Assurance, A-LIGN, Sensiba, Marcum, Armanino, BDO.** Pick one that specializes in your industry's size and tech stack.

## Engineer-facing realities

A few things engineers should internalize about SOC 2:

### "Evidence" is the unit of audit currency

When an auditor asks for a control, they want a screenshot, a log export, or a document. "It's in the code" doesn't count unless you can produce evidence from the code, a CI log, a screenshot of branch protection settings, a query result from the IAM table. Build everything with "can I screenshot this?" in mind.

### Tickets are your friend

Every change should have a ticket. Jira, Linear, GitHub Issues, pick one and stick to it. Auditors love:

- Sampling N tickets from the audit period.
- Asking "was this reviewed? Was this tested? Was this approved?"

A "what we're working on" board that links to PRs and incidents is the paper trail. Make it easy to search.

### Pen test findings need tracking

A pen test that finds 20 issues and you fix 15 is a pen test that ships to the auditor as "5 open issues with documented risk acceptance or remediation plan." Silent pen test findings are a SOC 2 hole.

### Production access is a big deal

"How do you get into prod?" should have a boring answer:

- SSO + MFA into a bastion / IAM SSO.
- JIT elevation via an approval workflow.
- Every production session logged.

Shared secrets, permanent root credentials, or "sometimes we just ssh in" are audit findings.

### Zero-trust isn't in SOC 2, but it helps

The AICPA framework doesn't mandate zero-trust architecture. But it is the easiest way to pass the access controls. VPN-based perimeters increasingly look outdated to auditors.

## Common findings

The most common SOC 2 exceptions:

1. **Access review signed late**, quarterly review that slipped to 100 days.
2. **Terminated user still has access.** Even a revoked SSO account can leave residue (API tokens, GitHub outside collaborator).
3. **Policy not reviewed this year.** Auditor sees last update date > 12 months ago.
4. **Critical CVE not patched within SLA.** Snyk shows a `critical` CVE older than your own policy allows.
5. **Production change without a ticket.** `main` has a commit that doesn't tie to a ticket or PR.
6. **Missing approvals.** PR merged by the author without review, or merged with a stale review.
7. **Backup not tested.** Backups run; restore hasn't been attempted.
8. **Tabletop exercise not documented.** You talked through it; no meeting notes exist.

Every one of these is a process discipline issue, not a tech issue. The technical gap is usually the easier fix.

## What SOC 2 doesn't prove

- It doesn't prove the code is secure. No one reviews your code during an audit.
- It doesn't prove your product works. Controls exist around engineering; product quality isn't in scope.
- It doesn't prove customer data is isolated. Multi-tenant isolation is a control *you* design; the auditor checks that you follow it, not that it's bulletproof.
- It doesn't prove you'd survive a breach. It proves you have a plan.

Treat SOC 2 as the floor, not the ceiling. A team serious about security does more than SOC 2 requires.

## When to start

- **Have 3+ customers asking for it:** start now.
- **One whale asking for it:** start now; the deal value justifies the ~$30–70k all-in cost.
- **No enterprise pipeline yet:** defer. SOC 2 has real ongoing costs (audit fees, compliance platform, policy maintenance). Don't pay for the badge you don't need.

## References

- [AICPA, SOC for Service Organizations](https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services)
- [SOC 2 Trust Services Criteria (AICPA)](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022)
- [Vanta, SOC 2 compliance guide](https://www.vanta.com/products/soc-2)
- [Drata, SOC 2 controls list](https://drata.com/grc-central/soc-2/controls-list)
- [Anton Chuvakin on SOC 2 monitoring](https://medium.com/anton-on-security), long-running security blog
- [Securing DevOps, Julien Vehent](https://www.manning.com/books/securing-devops), broader context on controls engineers actually implement

## Related topics and posts

- [Django Part 10, Production](../../topics/web/django/part-10-production/), the technical hardening side
- [GitOps](../../topics/ops/gitops/), provides an audit trail almost for free
- [Multi-tenant Django that fails closed](../2026-04-24-multi-tenant-django-fails-closed/), isolation as a control
- Posts on [HIPAA](../2026-04-24-hipaa-for-software-engineers/) and [OASIS](../2026-04-24-oasis-in-home-health-software/), the healthcare compliance companions
