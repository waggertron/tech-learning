---
title: OASIS in home-health software, the assessment data model you didn't ask for
description: The CMS-mandated patient assessment behind every US home-health agency, what OASIS-E is, why it's 90+ "M-items," the five encounter types, how it's submitted, and why building software around it is harder than it looks.
date: 2026-04-24
tags: [oasis, home-health, healthcare, medicare, cms, compliance]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-oasis-in-home-health-software/
---

## What OASIS is

**OASIS, Outcome and Assessment Information Set**, is a standardized patient assessment dataset required by the Centers for Medicare & Medicaid Services (CMS) for every Medicare- or Medicaid-certified home health agency (HHA) in the United States.

It's **required**. Not "used by most agencies", legally required. An HHA cannot bill Medicare without submitting an OASIS assessment for each patient.

It's used for three distinct purposes, each important to different parts of the industry:

1. **Payment**, the Patient-Driven Groupings Model (PDGM) maps OASIS responses to HIPPS payment codes.
2. **Quality reporting**, Home Health Value-Based Purchasing, Home Health Compare star ratings, and the Home Health Quality Reporting Program all compute measures from OASIS.
3. **Care planning**, clinicians use the assessment to build the patient's plan of care.

Any software that touches home-health operations, EHRs, clinical documentation, billing, routing, ops consoles, interacts with OASIS somehow.

## The current version, OASIS-E / OASIS-E1

- **OASIS-E** went live **January 1, 2023**. It was the biggest overhaul since OASIS-C2 in 2017, adding cognitive assessment, social determinants of health, and Transfer of Health Information items to align with the IMPACT Act.
- **OASIS-E1** took effect **January 1, 2025**, adding new items (notably around COVID-19 vaccination) and modifying a handful of existing ones.

Versions matter. An EHR that's still emitting OASIS-D1 XML is submitting invalid assessments. The CMS submission portal will reject them.

CMS publishes the current version's **OASIS-E1 Guidance Manual**, data specifications, and XML schema on its [Home Health Quality Reporting](https://www.cms.gov/medicare/quality/home-health/quality-reporting-and-coding) pages. The schema alone is ~350 pages of PDF, worth downloading once so you can grep it.

## The five encounter types (Reason for Assessment)

OASIS isn't a one-time thing. Each patient has multiple assessments over their episode of care. The core `RFA` (Reason for Assessment) values:

| Code | Name | When it happens |
| --- | --- | --- |
| RFA 01 | Start of Care (SOC) | Within 5 days of the initial visit |
| RFA 03 | Resumption of Care (ROC) | After a qualifying inpatient stay |
| RFA 04 | Recertification (follow-up) | Last 5 days of each 60-day cert period |
| RFA 05 | Other Follow-up | Significant change in condition |
| RFA 06 | Transferred to Inpatient Facility (no discharge) | Patient goes to hospital, might return |
| RFA 07 | Transferred + Discharged | Patient hospitalized and agency discharges |
| RFA 08 | Death at Home | Self-explanatory |
| RFA 09 | Discharge from Agency (not to inpatient) | Routine discharge |

Different RFAs require different item sets. A discharge assessment doesn't require the full Start-of-Care battery, but it does require discharge-specific items. Software that treats OASIS as a single flat form misses 90% of the rule complexity.

## The data model, M-items (and O-, A-, B-, C-, D-, GG-items)

OASIS items are identified by alphanumeric codes. The bulk are **M-items** (e.g. `M0010`, `M1800`):

- `M0010`, CMS Certification Number
- `M0018`, National Provider Identifier
- `M0030`, Start of Care Date
- `M1021` / `M1023`, Primary and Other Diagnoses (ICD-10 codes)
- `M1800`–`M1910`, ADL / IADL items (bathing, dressing, toileting, ambulation)
- `M2020`–`M2030`, medications
- `M2102`, types and sources of assistance
- `M2401`, intervention synopsis
- `M2420`, discharge disposition

OASIS-E added new prefixes:

- **GG-items**, functional abilities (self-care, mobility), aligned with other post-acute settings
- **A-items**, patient admit info
- **B-items**, hearing, speech, vision
- **C-items**, cognitive patterns
- **D-items**, mood (PHQ-2/9)
- **J-items**, pain
- **O-items**, admission / medication reconciliation

That's **90+ items on a full Start-of-Care**. Every response has a controlled vocabulary, usually a fixed list of integer codes like `0 = Never, 1 = Once a day, ...`. Most items carry a set of skip rules: answering one question a certain way means skipping downstream items.

## Why the data model is harder than it looks

### 1. Skip logic is the hardest part

Nearly every item has conditions for when it's applicable:

- If the patient is comatose, skip the ADL assessment items.
- If the episode is a hospice admission, skip therapy items.
- If the RFA is Discharge, include `M2420` but not `M1021`.

CMS publishes decision trees. You implement them. Get one wrong and the submission either rejects (better) or silently accepts wrong data (worse, the agency will find out when their star rating drops six months later).

### 2. Response codes are not self-describing

The value `3` in `M1800` (Grooming) means "Unable to groom self and is totally dependent." The value `3` in `M1610` (Urinary Incontinence) means "Patient requires intermittent catheterization." Without the data dictionary, a dump of an OASIS response is opaque.

Build a schema-driven UI, not a hand-coded form. Otherwise every OASIS update means a manual rewrite.

### 3. Effective dates and retroactive rules

CMS publishes changes to items, response options, and skip logic at version boundaries. An assessment dated `2024-12-31` must use OASIS-E rules; an assessment dated `2025-01-01` must use OASIS-E1 rules. Your submission code needs to pick the correct schema by assessment date, not by today's date.

### 4. ICD-10 codes as OASIS items

`M1021` / `M1023` / `M1025` are diagnosis codes. Which means your OASIS code also needs to handle:

- ICD-10-CM lookups and validation.
- Manifestation/etiology rules (some codes can't stand alone, others can't be paired).
- Annual ICD-10 updates (October 1 every year).

This is sometimes outsourced to a clinical coding service; sometimes embedded via a medical-terminology vendor (IMO Health, Intelligent Medical Objects).

## Submission, iQIES and the XML schema

Since January 2020, OASIS is submitted through **iQIES** (Internet Quality Improvement and Evaluation System), the CMS portal.

### The file format

OASIS is submitted as **XML**, not JSON, not CSV. The schema is published by CMS and versioned with OASIS itself. A minimally-structured submission looks like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ASSESSMENT>
  <ASSMT_SYS_CD>OA</ASSMT_SYS_CD>
  <TRANS_TYPE_CD>01</TRANS_TYPE_CD>       <!-- New assessment -->
  <ITM_SBST_CD>02</ITM_SBST_CD>           <!-- Item subset: SOC -->
  <ITM_SET_VRSN_CD>OASIS-E1/1.00.0</ITM_SET_VRSN_CD>
  <SPEC_VRSN_CD>3.00.1</SPEC_VRSN_CD>
  <CORRECTION_NUM>00</CORRECTION_NUM>
  <STATE_CD>CA</STATE_CD>
  <M0010_CCN>057001</M0010_CCN>
  <M0030_START_CARE_DT>20250104</M0030_START_CARE_DT>
  <M1021_PRIMARY_DIAG_ICD>I10</M1021_PRIMARY_DIAG_ICD>
  <!-- ... dozens to hundreds more items ... -->
</ASSESSMENT>
```

Key gotchas:

- **Dates are `YYYYMMDD`**, no separators. Common bug.
- **All item codes are prefixed with the M-code** (e.g. `<M0030_START_CARE_DT>`).
- **Empty / skipped items must be present with a specific skip indicator**, depending on item rules. Missing elements fail schema validation.
- **Character encoding is strict UTF-8**, and certain characters (tabs, angle brackets, some emojis) must be entity-escaped.
- **One submission can contain multiple assessments.** Each wrapped in an `<ASSESSMENT>` element.

### Validation and correction

iQIES runs multi-pass validation:

1. **Schema validation**, is the XML well-formed and matches the XSD?
2. **Edit validation**, are the skip-logic rules satisfied? Are code values valid for the item?
3. **Consistency validation**, do dates make sense (SOC before ROC before Discharge)?
4. **Timing**, was the assessment submitted within the required 30-day window?

Validation errors are returned as a list of item codes and error codes. Your software has to surface them to the clinician, let them correct the assessment, and resubmit, often as a correction (`TRANS_TYPE_CD=02` with matching `CORRECTION_NUM` and `CORRECTION_AUTH_CD`).

### Lock and submission status

Each assessment has a lifecycle:

```
in-progress → completed → locked → submitted → accepted | rejected
```

Clinicians can't edit a locked assessment. Corrections after submission are their own workflow with their own rules. An EHR that lets clinicians "fix a typo" on a submitted OASIS is producing audit findings.

## How OASIS drives payment, PDGM

The **Patient-Driven Groupings Model** (PDGM) replaced the old PPS model in 2020. Each 30-day billing period is classified into one of **432 case-mix groups** based on:

1. **Clinical grouping** (from the primary diagnosis)
2. **Functional level** (Low / Medium / High, from specific OASIS items)
3. **Admission source** (community vs institutional)
4. **Timing** (early vs late in the episode)
5. **Comorbidity adjustment** (secondary diagnoses)

OASIS drives four of the five. Get the items wrong and the agency is paid the wrong amount. Get them systematically wrong and the agency gets clawbacks in audit.

Most home-health EHRs include a PDGM calculator that recomputes HIPPS codes live as clinicians edit OASIS items, so they can see payment implications and catch errors before lock.

## Star ratings and Home Health Compare

Quality measures computed from OASIS feed:

- **Home Health Compare**, public-facing star ratings at [medicare.gov](https://www.medicare.gov/care-compare/)
- **Home Health Value-Based Purchasing (HHVBP)**, payment adjustments based on quality scores
- **Home Health Quality Reporting Program (HHQRP)**, publishing requirement with a 2% Medicare pay cut for non-reporters

Measures are computed by CMS from submitted OASIS; your software doesn't compute them directly. But your software's accuracy directly determines the agency's stars.

## Engineering challenges specific to OASIS software

### Schema-driven everything

With ~90+ items, yearly changes, and skip logic, you can't hand-code forms. You drive the UI from a data dictionary:

- A JSON / YAML / XML representation of items, response options, and skip rules.
- A forms engine that renders the dictionary and enforces skip logic live.
- An export layer that serializes the responses to the submission XML.

This is the core architectural investment. Everything downstream (clinician UX, offline mode, submission, corrections, audit trail) depends on getting this right.

### Offline capture

Home-health clinicians visit patients, often in areas with poor or no connectivity. OASIS data often starts in a mobile app with no network. Sync, conflict resolution, and partial-save semantics are real engineering problems.

### Clinician-friendly UX

OASIS asks brutal questions. A clinician enters 100+ items per patient, sometimes in a noisy living room with a confused patient. Good OASIS UI is aggressive about:

- Pre-filling from prior assessments (last SOC → this Recert).
- Hiding skipped items instantly as skip conditions are met.
- Inline validation (not "submit and learn your M1800 was wrong").
- Auto-save on every change.
- PDGM / HIPPS preview so the clinician sees the payment implication of a response.

### Integration with the rest of the system

OASIS doesn't live alone:

- **ICD-10 coding system**, `M1021` etc.
- **Plan of Care (Form CMS-485)**, separate artifact, often regenerated from OASIS responses.
- **Billing**, claim creation consumes the HIPPS code from OASIS.
- **Physician orders**, some OASIS items reference physician orders which live elsewhere.

A siloed OASIS module is less useful than one integrated into the clinician's charting workflow.

### The audit trail

Every edit to an OASIS item by every user needs a log. Not nice-to-have, regulatory. Auditors reviewing a questionable submission ask "who entered this value, when, and from where?" If you can't answer, the agency is in trouble.

### PHI everywhere

OASIS data is PHI. All of it. See the [HIPAA post](./2026-04-24-hipaa-for-software-engineers/) for the full treatment. Specific to OASIS:

- Submission XML files contain raw PHI. Storage and transit are encrypted.
- Export features (CSV, PDF) need audit logging and access controls.
- BI dashboards built off OASIS data need de-identification or cell-suppression for small-count populations.

## Who builds OASIS software

The major commercial home-health EHRs:

- **HCHB (Homecare Homebase)**, large market share
- **WellSky Home Health**, formerly Kinnser
- **Axxess**, widely used in mid-sized HHAs
- **Netsmart myUnity**, both clinical and financial
- **Alora Home Health**, smaller, cloud-first
- **MatrixCare**, part of ResMed, broader post-acute

Plus a long tail of smaller vendors and in-house tools at large HHAs.

Newer entrants building around dispatch, routing, patient engagement, and AI (like Axle Health) either integrate with an existing OASIS-certified EHR or build their own. OASIS *certification*, the ability to produce a schema-valid, CMS-accepted submission, is real engineering investment, which is why most ops-focused tools integrate rather than replace.

## A pragmatic starter approach

If you're actually building OASIS capture:

1. **Download the OASIS-E1 spec** (data dictionary, XSD, manual) from CMS. Read the manual cover to cover once.
2. **Model the items as data**, not code. JSON / YAML schema that can be regenerated year over year.
3. **Pick a forms engine** that supports skip logic natively, or build one.
4. **Implement XML submission to the iQIES spec.** Test with the CMS-provided test environments.
5. **Pick an ICD-10 source.** The CMS free download is fine for a portfolio project; production systems use IMO Health or similar for clinical concept mapping.
6. **Write a PDGM calculator.** The logic is public; the tricky part is keeping it current with annual updates.
7. **Build the audit trail first.** Don't retrofit it, every mutation writes an audit entry from day one.
8. **Get a real clinician to test the UX.** OASIS is tolerable for clinicians who know what they're doing; for everyone else it's a slog. UX matters.

## Non-goals for most teams

You almost certainly should not build:

- **Your own OASIS *certification* toolchain** if an existing EHR is in the picture, hook in via HL7/FHIR or vendor APIs.
- **Your own PDGM / HIPPS engine from scratch** if licensing one is affordable, the rules are intricate.
- **Your own clinical coding** for ICD-10, use a terminology vendor.
- **A competing EHR** unless you've raised for it and staffed clinically.

Most operational tooling in home health (dispatch, routing, patient engagement) should leave OASIS to the clinical system of record and integrate.

## References

- [CMS, Home Health Quality Reporting Program](https://www.cms.gov/medicare/quality/home-health/quality-reporting-and-coding), authoritative source for the OASIS spec
- [OASIS-E1 Guidance Manual (CMS)](https://www.cms.gov/medicare/quality/home-health/hhqrp-oasis-user-manuals), the ~350-page clinician reference
- [iQIES](https://iqies.cms.gov/), submission portal
- [Home Health Compare](https://www.medicare.gov/care-compare/), where quality measures surface publicly
- [HHVBP overview (CMS)](https://www.cms.gov/medicare/quality/home-health/hhvbp-model), how the quality data affects payment
- [PDGM overview (CMS)](https://www.cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps/hh-pdgm), the payment model
- [OASIS-E to OASIS-E1 differences (CMS memo)](https://www.cms.gov/files/document/oasis-e1-change-table.pdf)

## Related topics and posts

- [HIPAA for software engineers](./2026-04-24-hipaa-for-software-engineers/), how OASIS data must be protected
- [SOC 2 for software engineers](./2026-04-24-soc-2-for-software-engineers/), the audit that sits alongside HIPAA
- [Vehicle Routing Problem topic](../topics/cs/vehicle-routing/), the operational layer that sits on top of OASIS-driven scheduling
- [Multi-tenant Django that fails closed](./2026-04-24-multi-tenant-django-fails-closed/), the tenancy pattern for multi-agency OASIS software
