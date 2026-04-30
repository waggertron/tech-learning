---
title: HIPAA for software engineers, Privacy Rule, Security Rule, and the BAA
description: The 1996 law that shapes every line of code touching US health data. What counts as PHI, what the Security Rule's technical safeguards actually require, what a Business Associate Agreement binds you to, and the cloud services you're allowed to use.
date: 2026-04-24
tags: [hipaa, compliance, healthcare, security, phi]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-hipaa-for-software-engineers/
---

## What HIPAA actually is

The **Health Insurance Portability and Accountability Act of 1996** is a US federal law. Enforced by the Department of Health and Human Services' **Office for Civil Rights (OCR)**. Two parts matter for software engineers:

- **Privacy Rule** (2003), governs who can see Protected Health Information (PHI) and for what purposes.
- **Security Rule** (2005), governs how PHI is protected *electronically* (ePHI).

The **HITECH Act (2009)** amended HIPAA to extend direct liability to Business Associates (software vendors), add the Breach Notification Rule, and dramatically increase penalties.

Violations can run from **$137 per incident up to $2.07M per year** per violation category, plus state-level penalties and civil suits. OCR publishes every settlement on a public wall of shame.

HIPAA **only applies** to:

- **Covered Entities (CEs):** health plans, health-care clearinghouses, health-care providers that bill electronically.
- **Business Associates (BAs):** anyone who creates, receives, maintains, or transmits PHI on behalf of a CE. This is where most software companies land.

Consumer fitness apps, direct-to-consumer mental-wellness apps, nutrition trackers without a clinical partner, **none of these are HIPAA-regulated.** They might be subject to the FTC Health Breach Notification Rule and various state laws, but not HIPAA.

## What counts as PHI

PHI = individually identifiable health information. HIPAA names **18 identifiers**; if any of them appears alongside health/treatment/payment data, it's PHI:

1. Names
2. Geographic data smaller than a state (ZIP codes down to 3 digits can sometimes be okay)
3. Dates (birth, admission, discharge, death), except year alone if the person is under 89
4. Phone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate / license numbers
12. Vehicle identifiers (including plates)
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifying number, characteristic, or code

If you strip **all 18** (the "Safe Harbor" method of de-identification), the data is no longer PHI and HIPAA no longer applies. Alternatively, an expert statistician can certify it (the "Expert Determination" method).

Practical implication: **a UUID + DOB + visit date is PHI.** Don't kid yourself about "but it's anonymized."

## The Business Associate Agreement (BAA)

Every vendor between a CE and the data must sign a BAA. The BAA is a contract binding the BA to:

- Use PHI only as permitted.
- Implement HIPAA Security Rule safeguards.
- Report breaches to the CE within a specified window (usually 60 days; contracts often shorten this to 10).
- Terminate the relationship or destroy PHI at contract end.
- Pass down the same obligations to any subcontractors (e.g. their cloud provider).

**If you don't have a BAA in place with every vendor handling PHI, you are out of compliance the moment the data touches their systems.** This is the single most common HIPAA failure in a software company.

## The Security Rule, what the code has to do

The Security Rule divides requirements into three categories: **administrative, physical, technical**. Engineers see the technical ones most, but the others bleed into product decisions.

### Technical safeguards (the big one for engineers)

Five required standards:

#### 1. Access Control (§164.312(a))

- **Unique User Identification**, every person has their own account. No shared logins. Ever.
- **Emergency Access**, a break-glass procedure to get into PHI during an incident.
- **Automatic Logoff** (addressable), idle sessions time out. Typical: 15 minutes for admin consoles; 30 minutes or less for clinical interfaces.
- **Encryption and Decryption** (addressable), if you implement encryption, it must be proper encryption. (See more below.)

Implementation in a typical SaaS:

```python
# Example, Django auto-logoff via session cookie expiry
SESSION_COOKIE_AGE = 15 * 60            # 15 minutes idle
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
```

And for server-side timeout enforcement, pair with middleware that invalidates sessions on inactivity.

#### 2. Audit Controls (§164.312(b))

You must log access to ePHI. Who viewed what, when. This is not debatable, it's the single hardest technical requirement to implement well.

Minimum audit log fields:

- Timestamp (with timezone)
- User ID (must be real human, not a service account for this purpose)
- Action (view, create, update, delete, export)
- Resource (patient ID, record type, record ID)
- Source IP

Audit logs themselves must be:

- Tamper-resistant (append-only, often via a logging service the engineers can't delete from)
- Retained for 6 years (HIPAA), longer for some state laws
- Searchable, because when OCR shows up, they want specific records quickly

Typical implementation:

```python
# middleware that records every PHI access
class PHIAccessAuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if _touches_phi(request):
            PHIAccessLog.objects.create(
                user_id=request.user.id,
                action=request.method,
                path=request.path,
                patient_id=_extract_patient_id(request),
                ip=request.META.get("REMOTE_ADDR"),
                user_agent=request.META.get("HTTP_USER_AGENT"),
                ts=timezone.now(),
            )
        return response
```

Ship logs to an append-only store: CloudWatch Logs with write-only IAM, or a dedicated audit service like **Datadog, Splunk, or Loki** with retention lock.

#### 3. Integrity (§164.312(c))

ePHI must be protected from improper alteration or destruction. In practice:

- Database-level versioning on PHI tables (or a tested audit trail that reconstructs history).
- Checksums on stored files.
- Backup verification, if you can't restore, you don't have integrity.

#### 4. Person or Entity Authentication (§164.312(d))

Verify anyone accessing ePHI is who they claim. In 2026 this translates to:

- SSO with SAML or OIDC (no password-only logins for clinical apps).
- MFA required, and ideally phishing-resistant (WebAuthn / hardware keys) for admin access.
- Service accounts use short-lived tokens, not static API keys.

#### 5. Transmission Security (§164.312(e))

Encrypt PHI in transit. TLS 1.2 minimum; 1.3 preferred. No plain HTTP, no unencrypted SMTP for PHI, no SFTP without strong ciphers.

**Internal service-to-service traffic** counts. A VPC isn't enough, encrypt inside the VPC too, via mTLS or service-mesh policy.

### Administrative safeguards (partial list)

These are process, but engineers often implement or enable them:

- **Workforce training**, annual HIPAA training for anyone who touches PHI.
- **Access management procedures**, how access is granted, reviewed, revoked.
- **Security Risk Analysis**, annual. Required. Document it or OCR finds you have nothing.
- **Incident response procedures**, who responds, what they do, how it's documented.
- **Contingency plan**, DR + backups + testing.

### Physical safeguards

Mostly data-center concerns for hosted services. If your vendors are HIPAA-BAA'd AWS/GCP/Azure, they handle this and pass it through.

For on-prem or hybrid deployments: locked server rooms, logged access, device disposal procedures.

## Cloud services and HIPAA eligibility

Major cloud providers publish lists of **HIPAA-eligible services**, the services they'll sign a BAA covering. Anything outside the list, you can't put PHI in.

### AWS

- [AWS HIPAA-eligible services list](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/), 150+ services including EC2, S3, RDS, DynamoDB, Lambda, ECS, EKS, Athena, SageMaker, Bedrock.
- Sign a BAA via AWS Artifact (instant for paid support plans).
- **Not eligible historically:** some new services (check before using), most AWS Support conversations, SES inbound.

### GCP

- [Google Cloud HIPAA Implementation Guide](https://cloud.google.com/security/compliance/hipaa)
- BAA available in organizations with a Google Cloud Platform account.
- Covered services: GCE, GKE, Cloud Storage, BigQuery, Cloud SQL, Vertex AI, Document AI.

### Azure

- Broadest coverage among the three; see [Azure HIPAA / HITECH offering](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us).

### Beyond the big three

- **Snowflake, Databricks, MongoDB Atlas**, BAA-available for enterprise plans.
- **Twilio**, BAA-available for specific products (SMS, Voice, Email). **Free-tier Twilio is not BAA-eligible.**
- **SendGrid**, BAA via a specific compliance offering.
- **OpenAI, Anthropic**, BAAs available on enterprise plans; check current terms before sending PHI to an LLM.
- **Slack, Zoom, Google Workspace**, Enterprise plans with BAA only. The free and mid-tier versions are **not** BAA-covered.

### The practical implication

Every new tool added to the stack needs a BAA check. Your legal team maintains the list; your engineers should habitually ask "is this BAA'd?" before integrating.

## The Breach Notification Rule

A breach = unauthorized acquisition, access, use, or disclosure of unsecured PHI.

Required notifications:

- **Affected individuals**, within 60 days of discovery.
- **HHS**, within 60 days; immediately if 500+ individuals are affected.
- **Media**, if 500+ individuals in a single state or jurisdiction.
- **Business Associate to Covered Entity**, usually contractually 10 days, sometimes less.

"Unsecured" is the key word. PHI protected by encryption that meets NIST guidance is **not** considered "unsecured" for breach purposes. This is the most important reason to encrypt everything, everywhere: a stolen encrypted laptop that meets NIST is a bad day, not a mandatory breach notification.

Breach decisions are made by a formal risk assessment:

1. Nature and extent of PHI involved.
2. Unauthorized person who used the PHI or received the disclosure.
3. Whether PHI was actually acquired or viewed.
4. Extent to which risk has been mitigated.

If you can demonstrate low probability of compromise on all four factors, you may conclude no breach occurred, but the analysis must be documented.

## What "HIPAA-compliant software" looks like

Stripped to essentials:

### Authentication and authorization

- SSO (SAML / OIDC) as the only path in for real users.
- MFA required.
- RBAC at the data layer; minimum-necessary access principle.
- Break-glass procedure with enhanced logging.

### Encryption

- TLS 1.2+ for every external and internal connection.
- AES-256 at rest for databases, object storage, volumes.
- KMS-backed keys with key rotation.
- Client-side encryption for highly sensitive fields (SSN, genetics), defense in depth.

### Auditing

- Every PHI access logged with user, patient, action, timestamp.
- Logs written to append-only storage with 6+ year retention.
- Anomaly detection on access patterns.
- Quarterly audit log reviews.

### Data segregation (multi-tenant)

- Row-level tenancy enforced at the ORM or database level. See the [Multi-tenant Django post](../2026-04-24-multi-tenant-django-fails-closed/) for one pattern.
- Cross-tenant requests return 404, not 403. Don't confirm existence.
- Tenant context in every query path (middleware, background jobs, exports).

### Data lifecycle

- Retention schedule documented per data type.
- Deletion procedures actually delete (including from backups after a defined window).
- De-identification pipelines for analytics, never ship raw PHI to BI tooling.

### Operational

- Vulnerability management with defined SLAs.
- Annual penetration test by a qualified third party.
- Annual tabletop incident-response exercise.
- Dedicated HIPAA Security Officer and Privacy Officer (the law requires both; can be the same human).

## Things that trip up software teams

- **Email.** Plain email is rarely HIPAA-safe. Use BAA'd email (secure-email gateway, or patient portals with in-app messaging).
- **SMS.** Carrier SMS is not HIPAA-compliant; patient identifiers + health info over SMS is a risk. Use secure-messaging platforms, or scrub content to appointment-only info.
- **Analytics scripts on PHI pages.** Google Analytics, Meta Pixel, Hotjar, these have caused multiple HIPAA breach settlements. Don't put them on pages that display PHI unless you've scrubbed it or have a BAA with the vendor.
- **Local development.** Engineers pulling prod data to laptops. Never. Synthetic data or a de-identified copy only.
- **Screenshots.** Someone posts a screenshot of a bug into Slack, PHI. Train people.
- **Support tools.** Intercom, Zendesk, Help Scout, need BAAs. Most offer HIPAA-enterprise tiers.
- **LLM prompts.** Pasting patient notes into a non-BAA'd LLM is a breach. Even if you have a BAA, understand the data-retention terms.
- **Third-party auth libraries.** If an SSO library's logs capture PHI (e.g. full URLs with patient IDs), those logs are now PHI.
- **Staging environments with prod data.** Staging often has laxer controls; copying prod PHI in is an incident.

## A pragmatic starter checklist

If you're starting a HIPAA-regulated product from scratch:

1. Sign BAAs with cloud providers, Datadog/logging, email/SMS, and every PII-touching vendor *before* writing code.
2. Pick a HIPAA-eligible region and stack. Document which services are in scope.
3. Enable encryption on every storage service on day one. KMS keys scoped per-tenant if you can.
4. SSO + MFA. No password-only accounts for real users. No shared accounts ever.
5. Row-level tenancy that fails closed. Not a switch you can turn off.
6. Audit logging as middleware, not a thing engineers remember to add.
7. Separate prod and non-prod with no production data in non-prod. Automate synthetic data instead.
8. Annual pen test and risk assessment on the calendar from day one.
9. Written Privacy Officer / Security Officer, name the person.
10. Breach response plan written, tested, and rehearsed.

That's the shape. Execution takes 6–12 months for a real compliance posture.

## When HIPAA doesn't apply but adjacent rules do

- **GDPR / UK GDPR**, if EU patients are involved. Stricter in many dimensions; breach notifications are 72 hours.
- **State laws**, California's CMIA, Texas HB 300, New York's SHIELD Act. Often stricter than HIPAA; the state-law delta is a separate analysis.
- **FTC Health Breach Notification Rule**, for non-HIPAA health apps. Expanded scope in 2024.
- **21st Century Cures Act**, specifically addresses information blocking; a different compliance concern for certain EHR-adjacent products.

## References

- [HHS, HIPAA for Professionals](https://www.hhs.gov/hipaa/for-professionals/index.html), the authoritative source
- [NIST SP 800-66 Rev. 2](https://csrc.nist.gov/pubs/sp/800/66/r2/final), implementing the HIPAA Security Rule
- [OCR HIPAA audit protocol](https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/audit/protocol/index.html), what the audit actually looks like
- [HHS Wall of Shame](https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf), every reported breach affecting 500+ individuals
- [AWS HIPAA eligible services](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/)
- [Google Cloud HIPAA compliance](https://cloud.google.com/security/compliance/hipaa)
- [Microsoft Azure HIPAA](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-hipaa-us)

## Related topics and posts

- [Multi-tenant Django that fails closed](../2026-04-24-multi-tenant-django-fails-closed/), the tenancy pattern HIPAA effectively forces
- [Django Part 10, Production](../../topics/web/django/part-10-production/), the hardening that covers most HIPAA technical safeguards
- [SOC 2 for software engineers](../2026-04-24-soc-2-for-software-engineers/), the audit that enterprise customers ask for alongside HIPAA
- [OASIS in home-health software](../2026-04-24-oasis-in-home-health-software/), the domain-specific data model that HIPAA governs in this context
