---
title: "From shared callback queues to atomic claims and safe retries"
description: "Build a multi-location clinic data model through questions, then use PostgreSQL transactions and idempotency records to protect callback claims and replay lost responses."
date: 2026-11-09
tags: [system-design, data-modeling, postgresql, sql, python, transactions, concurrency-control, race-conditions, row-locking, atomicity, idempotency, multi-tenancy, access-control, distributed-systems]
canonical: https://waggertron.github.io/tech-learning/posts/2026-11-09-atomic-callback-claims-and-safe-retries/
---

> Design a dashboard for clinic organizations with multiple locations. Receptionists need to see incoming and missed calls and coordinate calling people back. Some staff cover more than one location. An external phone provider handles the calls and sends our application updates.
>
> What would you clarify, how would you model the data, and how would you design the callback workflow?

The examples below use fictional organizations, people, and identifiers. Each question exposes a requirement before adding the mechanism that addresses it. The complete SQL and Python example implements callback claims and retries, not a complete phone system or dashboard.

Follow the questions in order, or return to [the race](#two-receptionists-one-task), [safe retries](#a-committed-claim-with-a-lost-response), [the surrounding model](#complete-the-surrounding-model), or [the complete example](#run-the-complete-example).

## Clarify the product before choosing components

### Who can do what?

**Before:** The dashboard displays provider information.

```text
[Receptionist] ---- reads ----> [Call list]
```

**Question:** Is viewing calls enough, or does the application coordinate follow-up work?

**Answer:** For this example, staff view missed calls and claim responsibility for callbacks. Claiming does not place a telephone call. It records who will handle the follow-up.

**Why add a workflow:** A display can reflect provider observations. A claim is a business decision that our application owns and stores. It needs a rule for who may change it.

Ask about release, completion, notes, and supervisor reassignment too. Each adds a distinct operation: who can perform it, from which state, and what history to preserve. The runnable example implements claiming only. Its schema can represent completed tasks, but it does not provide a completion endpoint or supervisor override.

**After:** Displaying a call and accepting responsibility are separate actions.

```text
[Receptionist] ---- reads ----> [Call list]
       |
       +---- claims ---------> [Callback responsibility]
```

### Who can read/write?

**Before:** One list has no defined ownership or visibility rules.

```text
[Alice] --\
          +----> [All missed calls]
[Bob] ----/
```

**Question:** Should we query missed calls per user, per location, or per user and location?

**Answer:** Both location and user views are useful. Unclaimed callbacks belong to a location's shared queue. Claimed work also appears in the assignee's view. Alice works at North and South. Bob works only at North.

**Why keep both:** Requiring an assignee in every query would hide work nobody has claimed. Location ownership answers where the work belongs. Assignment answers who is responsible for it.

Expand the access questions before writing authorization code:

- **Who can see another person's work?** Assume staff can see the shared queue and ownership at their authorized locations. That visibility helps them coordinate.
- **Who can change it?** Claiming requires active location access and an unclaimed task. A future release or completion action would need its own assignee or supervisor rule.
- **Can a supervisor cover several locations?** Yes, if memberships grant that access. A role name alone does not imply organization-wide access.
- **Can staff access another organization?** Only through separately authorized memberships. Knowing another task's ID does not grant access.

**After:** Both views are constrained by authorized locations.

```text
[Alice: North + South] --> [Shared location queues]
           |                       ^
           +--> [My callbacks]     |
                                   |
[Bob: North] ------------> [North queue only]
```

### How fast?

**Before:** The list and mutation have no freshness contract.

```text
[Browser list] <---- updates ---- [Server]
      |
      +---------- Claim --------> [Server]
```

**Question:** Can the list lag a few seconds? What happens if a user acts on stale information?

**Answer:** Assume a short display delay is acceptable. The server still decides every claim against authoritative state. A rejected claim gets a clear conflict response and a refreshed view.

**Why separate these requirements:** Faster screen updates improve usability, but two people can still act before either sees the other's change. Display freshness cannot enforce exclusive ownership.

Clarify provider-to-screen delay separately from claim response time. Ask whether targets describe typical or slow-tail latency, what users see during an outage, and how many staff act concurrently. These answers guide polling versus push, timeout behavior, and load testing. They do not follow from the word “real-time.”

**After:** A briefly stale display is allowed; an incorrect ownership decision is not.

```text
[Browser list] <---- may lag a few seconds ---- [Server]
      |
      +---- Claim ----> [Authoritative decision] ----> [Result]
```

## Build the smallest model that supports the workflow

### Add organizations for the customer boundary

**Before:** Every record belongs to one undifferentiated application.

```text
[Application] ---- owns ---- [All clinic data]
```

**Question:** Can unrelated clinic businesses use this application?

**Answer:** Yes. Add `organizations`, with one row for each customer organization.

**Why:** We need a durable ownership boundary. Tenant-owned records carry `organization_id`, and authorization evaluates that boundary. An organization ID is a scope identifier, not proof of access.

**After:** One application serves separate organizations.

```text
[Application] ----> [Organization 1] ----> [Its data]
       |
       +----------> [Organization 2] ----> [Its data]
```

### Add locations without duplicating organizations

**Before:** An organization has no way to distinguish its sites.

```text
[Organization 1] ----> [All work]
```

**Question:** Does North belong to a different customer from South?

**Answer:** No. Both are locations within organization 1. Add `locations`.

**Why:** Work is grouped by site, while some records, such as contacts, are shared across the organization. Creating a separate organization for every site would lose that distinction. One organization has many locations, often written `1 -> many`.

The location's primary key combines `(organization_id, id)`. A primary key uniquely identifies a row. Combining columns makes the location's organization part of that identity.

**After:** Site ownership is explicit.

```text
[Organization 1] ----> [North: location 10]
       |
       +------------> [South: location 20]
```

### Add users for people

**Before:** A location appears to own the receptionist's identity.

```text
[North] ----> [Alice at North]
[South] ----> [Alice at South?]
```

**Question:** Is Alice a different person when she covers another site?

**Answer:** No. Add one `app_users` row for Alice, identified as user 101. Bob is user 202.

**Why:** Identity survives changes in assignments. Duplicating Alice's account at every site would split her history and make “my work” harder to define.

**After:** Alice has one identity, independent of site access.

```text
[North]             [South]
          [Alice: user 101]
          [Bob:   user 202]
```

### Add memberships for access at multiple locations

**Before:** Users and locations exist, but access is not represented.

```text
[Alice]       ?       [North]
[Bob]         ?       [South]
```

**Question:** How can Alice work at two sites while Bob works at one?

**Answer:** Add `location_memberships`, linking an organization, location, and user. Store role and active status on the membership.

**Why:** Many users can work at a location, and one user can work at many locations. The linking table represents that many-to-many relationship without duplicating users. Location-specific roles and revocation now have a place to live.

```sql
SELECT l.id, l.name, m.role
FROM location_memberships AS m
JOIN locations AS l
  ON l.organization_id = m.organization_id
 AND l.id = m.location_id
WHERE m.organization_id = 1
  AND m.user_id = 101
  AND m.active;
```

The seeded example returns North and South for Alice. The service derives the user from authentication; accepting `user_id = 101` from a browser is not authentication.

**After:** Access is a relationship with its own state.

```text
[Alice] ---- membership ----> [North]
   |
   +------- membership ----> [South]
[Bob] ------ membership ----> [North]
```

### Add calls for the conversation

**Before:** A list item mixes a phone-system observation with staff action.

```text
[Missed call / claimed / completed: one unclear record]
```

**Question:** Does claiming a callback change what happened to the original call?

**Answer:** No. Add `calls` for the phone conversation and its current observed state. A call belongs to an organization and location.

**Why:** A missed call remains historically missed even after staff handle its follow-up. Provider details belong to the call, not to the staff assignment. Provider identities and observations will be added after the claim behavior is clear.

**After:** The call records what the phone system reports.

```text
[North] ----> [Call 1: missed]
                    |
              follow-up still undefined
```

### Add callback tasks for follow-up responsibility

**Before:** A missed call has no separate owner for its follow-up.

```text
[Call 1: missed] ----> [Who handles the callback?]
```

**Question:** Where should the receptionist's claim live?

**Answer:** Add `callback_tasks`. Task 77 belongs to organization 1, location 10, and call 1. It starts `unclaimed` with no assignee. In this version, a call has zero or one callback task.

**Why:** The task owns workflow state. The call owns the provider observation. The task's unique `(organization_id, call_id)` constraint prevents two tasks for the same call. Its status/assignee check rejects inconsistent combinations such as an unclaimed task with an owner.

After the service verifies the user's active access to North, its shared queue filters by organization, location, and unclaimed status:

```sql
SELECT id, call_id, status, assigned_user_id
FROM callback_tasks
WHERE organization_id = 1
  AND location_id = 10
  AND status = 'unclaimed'
ORDER BY created_at, id;
```

Alice's assigned view filters by user and still checks current membership:

```sql
SELECT t.id, t.location_id, t.call_id
FROM callback_tasks AS t
JOIN location_memberships AS m
  ON m.organization_id = t.organization_id
 AND m.location_id = t.location_id
 AND m.user_id = t.assigned_user_id
WHERE t.organization_id = 1
  AND t.assigned_user_id = 101
  AND t.status = 'claimed'
  AND m.active
ORDER BY t.created_at, t.id;
```

**After:** Ownership of the call and responsibility for the task are distinct.

```text
[North] ----> [Call 1: missed] ----> [Task 77: unclaimed]
                                            |
                                      assignee: none
```

## Two receptionists, one task

### Establish the ownership rule

**Before:** Both browsers show the same available task.

```text
[Alice's screen: task 77 unclaimed]
[Bob's screen:   task 77 unclaimed]
```

**Question:** Both click Claim. What should each person see?

**Answer:** One committed claim wins. The other request receives a conflict, and its screen refreshes to show current ownership.

**Why:** The rule is at most one successful transition from unclaimed to claimed. Click timing and screen freshness do not enforce it. The winner is the request the database successfully commits first, not necessarily the person who clicked first.

**After:** Assuming Alice wins, the outcomes differ.

```text
[Alice's request] ----> [Task 77: Alice owns it]
[Bob's request] ------> [Conflict: already claimed]
```

### Expose the check-then-write gap

**Before:** The application checks a value, then acts on that earlier value.

```text
[Read status] ---- gap ----> [Write assignment]
```

**Question:** What if Alice and Bob both read `unclaimed` before either writes?

**Answer:** Both pass the application check. The later unconditional write can overwrite the earlier assignment. This is a race condition: the outcome depends on interleaving operations.

**Why the check fails:** An ordinary read does not reserve the right to change the row. Wrapping the following statements in a Read Committed transaction does not by itself protect the gap.

This SQL demonstrates the bug. Do not use it as the claim implementation:

```sql
SELECT status
FROM callback_tasks
WHERE organization_id = 1 AND id = 77;

UPDATE callback_tasks
SET status = 'claimed', assigned_user_id = 101
WHERE organization_id = 1 AND id = 77;
```

**After:** The interleaved timeline exposes the broken outcome.

```text
Alice                         Bob
read: unclaimed
                              read: unclaimed
write: owner Alice
                              write: owner Bob
                              Alice's assignment overwritten
```

### Make the state change conditional

**Before:** A competing request can enter between checking and changing.

```text
[Check unclaimed] ---- another writer ----> [Assign]
```

**Question:** Can the database check and claim in one guarded operation?

**Answer:** Put the condition into the `UPDATE` itself. Alice's request becomes:

```sql
UPDATE callback_tasks
SET status = 'claimed', assigned_user_id = 101
WHERE organization_id = 1
  AND id = 77
  AND status = 'unclaimed'
RETURNING id, assigned_user_id;
```

If Alice changes the row, it returns `77, 101`. Bob attempts the same guarded change:

```sql
UPDATE callback_tasks
SET status = 'claimed', assigned_user_id = 202
WHERE organization_id = 1
  AND id = 77
  AND status = 'unclaimed'
RETURNING id, assigned_user_id;
```

**Why this works:** PostgreSQL coordinates competing updates with row locks. At Read Committed, Bob waits if Alice is still updating that row. If Alice commits, PostgreSQL rechecks Bob's condition against the committed row. It is no longer unclaimed, so Bob changes zero rows. An `UPDATE` already acquires the needed row lock. [PostgreSQL's Read Committed behavior](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED).

Atomicity describes the guarded state change. Locking is part of the mechanism used to coordinate writers. A separate `SELECT FOR UPDATE` is useful for some multi-statement decisions, but is unnecessary for this single-row claim.

**After:** The condition is checked where the change happens.

```text
Alice                         Bob
conditional update
row locked                    conditional update waits
COMMIT
                              recheck: claimed
                              zero rows changed
```

### Put the response after commit

**Before:** A returned row is being mistaken for a durable success.

```text
[UPDATE returns row] ----> [Send success] ----> [COMMIT?]
```

**Question:** What if the transaction fails after the update returns?

**Answer:** Send success only after commit succeeds. A transaction groups changes so they commit together or roll back together. `COMMIT` makes that transaction's changes committed; `ROLLBACK` discards them.

**Why:** Before commit, a failure can undo Alice's assignment. If Alice rolls back while Bob waits, Bob may proceed and claim the task. A row returned by the statement is evidence of an update inside the transaction, not proof that the transaction committed.

```sql
BEGIN;
UPDATE callback_tasks
SET status = 'claimed', assigned_user_id = 101
WHERE organization_id = 1 AND id = 77 AND status = 'unclaimed'
RETURNING id, assigned_user_id;
COMMIT;
```

The application sends success after that final statement succeeds.

**After:** The response describes a committed outcome.

```text
[BEGIN] --> [Conditional UPDATE] --> [COMMIT] --> [Send success]
                       |
                  failure --> [ROLLBACK] --> [No success]
```

## A committed claim with a lost response

### Add a record of the request's outcome

**Before:** The database knows Alice owns the task, but her browser never received the answer.

```text
[Alice's request] --> [Claim COMMIT] --> X response lost
[Alice's retry] ---------------------> [Task already claimed]
```

**Question:** What does another conditional update tell Alice?

**Answer:** It returns no row because the task is already claimed. That does not reproduce the original successful response for her particular request.

Add `claim_requests`, which stores a stable request key, the requested task, and the saved response.

**Why:** Current task state and an operation's historical outcome are different facts. The task answers who owns the work now. The request record answers what happened when this request ran.

This is the distinction between concurrency control and idempotency. Concurrency control arbitrates different actions, such as Alice and Bob competing. Idempotency identifies a repeat of the same action, such as Alice retrying. They solve different problems at both small and large scale.

**After:** A recognized retry can retrieve the original outcome.

```text
[New request] --> [Claim] --> [Saved response]
[Same request again] -------> [Replay saved response]
```

### Give the key a scope and a request meaning

**Before:** A bare key says nothing about its owner or intended task.

```text
[request key] ----> [? user, ? organization, ? task]
```

**Question:** What if two users choose the same key, or Alice reuses her key for a different task?

**Answer:** The claim-specific table identifies requests by `(organization_id, user_id, request_key)`. It also stores `task_id` and compares that value before replaying.

**Why:** The key's scope prevents unrelated users from sharing a request identity. Comparing the task rejects reuse with different input. If several operations shared this table, the identity would also need an operation identifier.

The schema makes the scoped identity its primary key, which also makes its columns non-null:

```sql
SELECT organization_id, user_id, request_key, task_id
FROM claim_requests
WHERE organization_id = 1
  AND user_id = 101
  AND request_key = 'alice-claim-01';
```

The lookup uses all three identity columns. The complete schema enforces that identity with a composite primary key.

**After:** One scoped key identifies one original request.

```text
[org 1, Alice 101, alice-claim-01] --> [task 77 + saved result]
[org 1, Bob 202,   bob-claim-01]   --> [task 77 + separate result]
```

### Reserve the key before executing

**Before:** Two copies of Alice's request can both find no saved result.

```text
First request                 Retry
read: no result               read: no result
execute?                      execute?
```

**Question:** How do we choose which copy gets to execute?

**Answer:** Attempt to insert the request identity under its unique constraint:

```sql
INSERT INTO claim_requests (
    organization_id, user_id, request_key, task_id
)
VALUES (1, 101, 'alice-claim-01', 77)
ON CONFLICT (organization_id, user_id, request_key)
DO NOTHING
RETURNING request_key;
```

**Why:** A returned row means this transaction reserved the key. No returned row means the application follows the replay branch. The uniqueness check participates in deciding who executes, closing the preliminary-read gap.

If the first insertion is uncommitted, the duplicate can wait. If the first transaction rolls back, its reservation disappears and the waiting insert may succeed. If it commits, the duplicate insertion does nothing. [PostgreSQL unique-index conflict handling](https://www.postgresql.org/docs/18/index-unique-checks.html).

**After:** Reservation coordinates copies of one request.

```text
First request                 Retry
reserve key                   same key: wait
execute and save result
COMMIT                        insertion skipped
                              read saved result
```

### Commit the claim and response together

**Before:** Ownership and its replay record can diverge.

```text
[Claim COMMIT] ---- crash ----> [Save response never happens]
```

**Question:** What should roll back if we crash after changing the task but before saving the response?

**Answer:** The reservation, claim, and saved response belong in one transaction. All three roll back if it fails before commit.

**Why:** A committed claim without its saved result recreates the uncertainty idempotency was supposed to resolve. Never commit an unfinished reservation.

For a newly reserved request whose conditional update succeeded, the statements fit together like this:

```sql
BEGIN;
INSERT INTO claim_requests (organization_id, user_id, request_key, task_id)
VALUES (1, 101, 'alice-claim-01', 77)
ON CONFLICT (organization_id, user_id, request_key) DO NOTHING
RETURNING request_key;

UPDATE callback_tasks
SET status = 'claimed', assigned_user_id = 101
WHERE organization_id = 1 AND id = 77 AND status = 'unclaimed'
RETURNING id, assigned_user_id;

UPDATE claim_requests
SET response_status = 200,
    response_body = '{"task_id":77,"assigned_user_id":101}'::jsonb
WHERE organization_id = 1 AND user_id = 101
  AND request_key = 'alice-claim-01';
COMMIT;
```

This is the success branch, not a script to run blindly on every request. The application branches on the first two results. An existing request follows replay. A new request that loses the claim stores `409` with `already_claimed`. The complete function below implements those branches.

**After:** Both evidence and ownership share the commit boundary.

```text
[BEGIN: reserve --> claim --> save result] --> [COMMIT] --> response
                    |
                  crash --> all three roll back
```

### Read replay with a fresh statement

**Before:** The duplicate insertion produced no row.

```text
[Duplicate reservation: skipped] ----> [Need original response]
```

**Question:** Where does Alice get the response she missed?

**Answer:** Run a separate statement to read the saved request:

```sql
SELECT task_id, response_status, response_body
FROM claim_requests
WHERE organization_id = 1
  AND user_id = 101
  AND request_key = 'alice-claim-01';
```

**Why:** At Read Committed, the new statement receives a new snapshot and can see the other transaction's committed record. A same-statement fallback can have a snapshot that predates the row even though that row prevented insertion. Keep insertion and replay lookup separate. [PostgreSQL statement snapshots](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED).

Compare `task_id` before returning the response. The example rejects a key reused for a different authorized task with `422`. Alice's matching retry returns the stored `200`, without attempting to claim the task again.

**After:** A retry follows the request record, not another task mutation.

```text
[Duplicate skipped] --> [Separate SELECT] --> [Verify task] --> [Replay]
```

### Bound the replay promise

**Before:** A saved success can be confused with current ownership or permanent permission.

```text
[Saved success] ----> [Assume Alice still owns task forever?]
```

**Question:** What if the task later changes, Alice loses access, or the record has expired?

**Answer:** Replay describes the original outcome. Current state comes from a fresh task read. The example checks active location membership before replaying. The request record must remain available for the promised retry window.

**Why:** History, current state, authorization, and retention answer different questions. None can safely stand in for all the others.

The function takes a shared lock on the qualifying membership while claiming or replaying. A competing membership update waits, so revocation and authorization have a transaction order. Membership rows are retained for historical relationships. The example treats task organization and location as immutable during this workflow.

The function saves successful `200` claims and business `409` conflicts. Invalid keys, missing tasks, failed access checks, and mismatched-key inputs follow its documented precondition policy rather than replacing the original saved response. Database errors roll back. Replays can still wait on locks even though they skip the callback update.

**After:** Replay has a defined scope.

```text
[Active access + matching request + retained result]
                         |
                 [Original response]

[Current task state] <---- separate authorized read
```

## Complete the surrounding model

### Add contacts for people behind numbers

**Before:** A call's phone number is treated as its caller's identity.

```text
[Call] ----> [Phone number = person?]
```

**Question:** Does a number prove who called?

**Answer:** No. Add `contacts` for people within an organization.

**Why:** A person has an identity beyond a number. Numbers can be shared or reassigned. A lookup can suggest contacts, but it does not confirm who was on a particular call.

**After:** Calls and people have separate identities.

```text
[Call: caller number]       [Contact: person]
             association still needs a model
```

### Add contact phones for shared and multiple numbers

**Before:** A single phone field forces one number per person.

```text
[Contact] ----> [One phone field]
```

**Question:** Can one person have several numbers, and several people share one number?

**Answer:** Yes. Add `contact_phones`. Make the contact-number pair unique within an organization, not the number alone.

**Why:** One contact can own several rows, and the same number can appear for several contacts. The seeded example gives Sam and Pat the same fictional number.

```sql
SELECT c.id, c.display_name
FROM contacts AS c
JOIN contact_phones AS p
  ON p.organization_id = c.organization_id AND p.contact_id = c.id
WHERE c.organization_id = 1
  AND p.normalized_number = '+12025550100';
```

This returns both candidates. The organization filter prevents cross-customer matching.

**After:** The model can represent both relationships.

```text
[Sam] ----> [shared number] <---- [Pat]
  |
  +-------> [another number]
```

### Add provider accounts to interpret external IDs

**Before:** A provider's bare call identifier is treated as globally unique.

```text
[external_call_id: call-one] ----> [Which account? Which organization?]
```

**Question:** What if different provider accounts both report `call-one`?

**Answer:** Add `provider_accounts`, mapping an external account to an organization. Interpret external call IDs within their documented account scope.

**Why:** External identifiers need context. The call identity includes organization, provider account, and external call ID. Trusted account configuration determines the organization for incoming events; an untrusted tenant field does not.

The complete schema enforces the scoped identity. This lookup uses it:

```sql
SELECT id, location_id, state
FROM calls
WHERE organization_id = 1
  AND provider_account_id = 1
  AND external_call_id = 'call-one';
```

**After:** Account ownership gives external identities a boundary.

```text
[Organization 1] --> [Provider account 1] --> [call-one]
[Organization 2] --> [Provider account 2] --> [call-one]
```

### Add call events to preserve observations

**Before:** Overwriting the current call row loses received evidence.

```text
[Ringing event] --> [Call row] <-- [Later or repeated event]
```

**Question:** Where do we remember what arrived and whether we processed it?

**Answer:** Add `call_events`, an inbox with provider event identity, external call ID, payload, arrival time, and processing marker.

**Why:** A current-state row and an observation log serve different reads. Event identity supports deduplication; the processing marker supports durable pending work. An event can arrive before the local call exists, so its external call identity does not require an immediate local call foreign key.

```sql
SELECT external_event_id, sequence, received_at, processed_at
FROM call_events
WHERE organization_id = 1 AND provider_account_id = 1
  AND external_call_id = 'call-one'
ORDER BY received_at, external_event_id;
```

This orders observations by arrival for inspection, not as proof of provider event order. Applying only the newest sequence can work for complete state snapshots. Incremental events may require gap detection and ordered application. Without trustworthy ordering, reconcile against an authoritative provider record when available.

**After:** Observations and current state coexist.

```text
[Provider] --> [Call-event inbox] --> [Project current call state]
                    |
             retain event evidence
```

The runnable example includes these tables but seeds calls directly. It does not implement webhook authentication, ingestion, or reconciliation.

### Enforce organization and location alignment

**Before:** Ownership columns exist, but weak references could connect unrelated rows.

```text
[Task: org 1, North] ---- call_id alone ----> [Call: org 2, West]
```

**Question:** Does storing an organization ID prevent this relationship?

**Answer:** No. The foreign key needs the ownership columns too. A foreign key requires a referenced parent key to exist. A composite foreign key compares several columns together.

**Why:** A task's `(organization_id, location_id, call_id)` references the corresponding call tuple. Its `(organization_id, location_id, assigned_user_id)` references a membership at the same location. The database rejects mismatched relationships rather than trusting every caller to remember the rule.

The complete table definitions include both constraints. To inspect task-to-call alignment:

```sql
SELECT t.id AS task_id, c.id AS call_id, c.location_id
FROM callback_tasks AS t
JOIN calls AS c
  ON c.organization_id = t.organization_id
 AND c.location_id = t.location_id
 AND c.id = t.call_id;
```

A membership foreign key proves the row exists, not that its `active` flag grants permission. The transaction's active check remains necessary. PostgreSQL documents [composite foreign keys and unique constraints](https://www.postgresql.org/docs/18/ddl-constraints.html).

**After:** Relationship keys preserve ownership together.

```text
[Task: org 1, North] -- org + location + call --> [Call: org 1, North]
         |
         +-- org + location + user --> [Membership: org 1, North]
```

## Add indexes for the reads we actually need

### Recent calls at one location

**Before:** Filtering and sorting may inspect more history than the screen needs.

```text
[All calls] --> filter location --> sort newest --> [Screen]
```

**Question:** Which ordering does the recent-call screen request?

**Answer:** Organization and location equality, then newest calls with a unique tie-breaker.

```sql
SELECT id, state, started_at
FROM calls
WHERE organization_id = 1 AND location_id = 10
ORDER BY started_at DESC, id DESC
LIMIT 50;

CREATE INDEX recent_calls
ON calls (organization_id, location_id, started_at DESC, id DESC);
```

**Why:** Equality on leading columns narrows the matching index range, followed by the requested order. The ID distinguishes equal timestamps. PostgreSQL describes this behavior for [multicolumn B-tree indexes](https://www.postgresql.org/docs/18/indexes-multicolumn.html).

**After:** The index matches the screen's access path.

```text
[org + location index range] --> newest time + ID --> [First 50]
```

### Shared and assigned callback queues

**Before:** Queue queries compete with completed history.

```text
[All tasks] --> filter status and scope --> sort --> [Queue]
```

**Question:** Can indexes focus on the rows each working queue reads?

**Answer:** Use partial indexes, which contain only rows satisfying a condition. The shared-queue query shown earlier needs unclaimed tasks by organization and location. The assigned-work query needs claimed tasks by organization and user.

```sql
CREATE INDEX pending_callbacks
ON callback_tasks (organization_id, location_id, created_at, id)
WHERE status = 'unclaimed';

CREATE INDEX my_callbacks
ON callback_tasks (organization_id, assigned_user_id, created_at, id)
WHERE status = 'claimed';
```

**Why:** These access paths avoid indexing completed rows for working-queue scans. Their column order follows the filters and chronological ordering. The partial condition has to match the query's requirements. [PostgreSQL partial indexes](https://www.postgresql.org/docs/18/indexes-partial.html).

**After:** Each view has an index for its scope and state.

```text
[Unclaimed index: org + location] --> [Shared queue]
[Claimed index: org + user] ------> [My callbacks]
```

### Contact lookup and exact identities

**Before:** One index shape is being assumed to serve every lookup.

```text
[Number lookup]     [Event deduplication]     [Request replay]
                  all need a matching key
```

**Question:** Which queries need a search index, and which already have an identity index?

**Answer:** The phone query filters by organization and number, so give it that index. Event and request lookups already use the composite primary keys established for identity.

```sql
CREATE INDEX phone_lookup
ON contact_phones (organization_id, normalized_number);

SELECT payload
FROM call_events
WHERE organization_id = 1 AND provider_account_id = 1
  AND external_event_id = 'event-one';

SELECT task_id, response_status, response_body
FROM claim_requests
WHERE organization_id = 1 AND user_id = 101
  AND request_key = 'alice-claim-01';
```

**Why:** Indexes should serve actual predicates. The contact-phone primary key groups rows by contact before number, so a number lookup deserves a different ordering. Adding duplicates of existing identity indexes would cost writes and storage without adding an access path.

**After:** Each lookup follows its own key.

```text
[org + number] ----------------> [Contact candidates]
[org + account + event ID] ----> [One event]
[org + user + request key] ----> [One saved request]
```

These index statements are teaching excerpts from the complete schema. Run the schema once rather than adding them twice. Inspect query plans with representative data before treating any index choice as a measured performance result.

## See the complete model and claim flow

All eleven entities now have a reason to exist. `*` means many, and `0..1` means optional and at most one.

```text
organizations 1 ---- * locations
locations     1 ---- * location_memberships * ---- 1 app_users
organizations 1 ---- * contacts 1 ---- * contact_phones
organizations 1 ---- * provider_accounts
provider_accounts 1 ---- * calls * ---- 1 locations
provider_accounts 1 ---- * call_events
calls         1 ---- 0..1 callback_tasks
location_memberships 1 ---- * callback_tasks (optional assignee)
callback_tasks 1 ---- * claim_requests * ---- 1 app_users

call_events resolve to calls by provider account + external call ID.
Tenant-owned relationships preserve organization and location scope.
```

The claim flow combines two decisions: whether this request is new, and whether its task is still available.

```text
[Authenticated caller + trusted organization context]
                         |
          [Begin Read Committed transaction]
                         |
       [Validate key; find task; check active access]
                         |
              [Reserve scoped request key]
                         |
                   Inserted a row?
                  /               \
                yes                no
                 |                  |
       [Conditional claim]   [Separate saved-result read]
                 |                  |
          Changed one row?     Same task?
           /          \        /       \
         yes           no    yes        no
          |             |     |          |
         200           409   Replay      422
           \           /      |      key reused
           [Save result]       |          |
                 \            |         /
                        [Commit]
                           |
                    [Return response]

Invalid key, missing task, or denied access: finish transaction, return result.
Unexpected database failure: rollback; do not report a committed success.
```

The authenticated identity comes from the service boundary. The function checks location membership, but is not itself a login system or a database-wide authorization policy. External callers do not receive direct table access in a deployed application.

## Run the complete example

The complete implementation packages the same reservation, replay, guarded update, and result-saving branches in a PostgreSQL function. PL/pgSQL is PostgreSQL's procedural language for expressing that branching beside SQL statements. Python owns the surrounding transaction and returns only after commit. The example is a command-line program, not an HTTP server. Its numeric response statuses make the business outcomes easy to map to an API later.

### Complete schema and claim function

The SQL below is the complete `schema.sql` from the tested example. A primary key also makes each of its columns non-null. The composite keys carry organization and location ownership through the relationships.

The numbered function sections correspond to the walkthrough: authorize, reserve, replay, claim, and save. The function uses PL/pgSQL, PostgreSQL's language for branching around SQL statements. Its `BEGIN ... END` encloses the function body; it does **not** commit a transaction. The caller controls commit and rollback.

The example trusts the service to supply the authenticated user and organization context. The function checks active location membership. It also holds a shared lock on that membership so a concurrent revocation coordinates with the claim. Call and task locations are immutable in this example.

```sql
CREATE TABLE organizations (
    id bigint PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE app_users (
    id bigint PRIMARY KEY,
    display_name text NOT NULL
);

CREATE TABLE locations (
    organization_id bigint REFERENCES organizations,
    id bigint,
    name text NOT NULL,
    PRIMARY KEY (organization_id, id)
);

CREATE TABLE location_memberships (
    organization_id bigint,
    location_id bigint,
    user_id bigint REFERENCES app_users,
    role text NOT NULL CHECK (role IN ('receptionist', 'supervisor')),
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (organization_id, location_id, user_id),
    FOREIGN KEY (organization_id, location_id) REFERENCES locations
);

CREATE TABLE contacts (
    organization_id bigint REFERENCES organizations,
    id bigint,
    display_name text NOT NULL,
    PRIMARY KEY (organization_id, id)
);

CREATE TABLE contact_phones (
    organization_id bigint,
    contact_id bigint,
    normalized_number text,
    PRIMARY KEY (organization_id, contact_id, normalized_number),
    FOREIGN KEY (organization_id, contact_id) REFERENCES contacts
);

CREATE INDEX phone_lookup ON contact_phones(organization_id, normalized_number);

CREATE TABLE provider_accounts (
    organization_id bigint REFERENCES organizations,
    id bigint,
    provider text NOT NULL,
    external_account_id text NOT NULL,
    PRIMARY KEY (organization_id, id),
    UNIQUE (provider, external_account_id)
);

CREATE TABLE calls (
    organization_id bigint,
    id bigint,
    location_id bigint NOT NULL,
    provider_account_id bigint NOT NULL,
    external_call_id text NOT NULL,
    caller_number text NOT NULL,
    started_at timestamptz NOT NULL,
    state text NOT NULL CHECK (state IN ('ringing', 'answered', 'missed')),
    last_sequence bigint,
    PRIMARY KEY (organization_id, id),
    UNIQUE (organization_id, location_id, id),
    UNIQUE (organization_id, provider_account_id, external_call_id),
    FOREIGN KEY (organization_id, location_id) REFERENCES locations,
    FOREIGN KEY (organization_id, provider_account_id) REFERENCES provider_accounts
);

CREATE TABLE call_events (
    organization_id bigint,
    provider_account_id bigint,
    external_event_id text,
    external_call_id text NOT NULL,
    sequence bigint,
    received_at timestamptz NOT NULL DEFAULT now(),
    processed_at timestamptz,
    payload jsonb NOT NULL,
    PRIMARY KEY (organization_id, provider_account_id, external_event_id),
    FOREIGN KEY (organization_id, provider_account_id) REFERENCES provider_accounts
);

CREATE TABLE callback_tasks (
    organization_id bigint,
    id bigint,
    location_id bigint NOT NULL,
    call_id bigint NOT NULL,
    status text NOT NULL DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'completed')),
    assigned_user_id bigint,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (organization_id, id),
    UNIQUE (organization_id, call_id),
    FOREIGN KEY (organization_id, location_id, call_id) REFERENCES calls(organization_id, location_id, id),
    FOREIGN KEY (organization_id, location_id, assigned_user_id) REFERENCES location_memberships,
    CHECK ((status = 'unclaimed' AND assigned_user_id IS NULL) OR (status <> 'unclaimed' AND assigned_user_id IS NOT NULL))
);

CREATE INDEX pending_callbacks ON callback_tasks(organization_id, location_id, created_at, id)
WHERE status = 'unclaimed';

CREATE TABLE claim_requests (
    organization_id bigint,
    user_id bigint REFERENCES app_users,
    request_key text CHECK (length(request_key) > 0),
    task_id bigint NOT NULL,
    response_status integer,
    response_body jsonb,
    PRIMARY KEY (organization_id, user_id, request_key),
    FOREIGN KEY (organization_id, task_id) REFERENCES callback_tasks,
    CHECK ((response_status IS NULL) = (response_body IS NULL))
);

CREATE INDEX recent_calls ON calls (organization_id, location_id, started_at DESC, id DESC);
CREATE INDEX my_callbacks ON callback_tasks (organization_id, assigned_user_id, created_at, id) WHERE status = 'claimed';

CREATE FUNCTION claim_callback(
    p_org_id bigint,
    p_user_id bigint,
    p_task_id bigint,
    p_request_key text
)
RETURNS TABLE(http_status integer, body jsonb)
LANGUAGE plpgsql VOLATILE AS $$
DECLARE
    v_location bigint;
    v_inserted text;
    v_saved claim_requests%ROWTYPE;
    v_claimed bigint;
    v_status integer;
    v_body jsonb;
BEGIN
    IF current_setting('transaction_isolation') <> 'read committed' THEN
        RAISE EXCEPTION 'claim_callback requires Read Committed';
    END IF;
    IF p_request_key IS NULL OR length(p_request_key) = 0 THEN
        RETURN QUERY SELECT 422, jsonb_build_object('error', 'invalid_key');
        RETURN;
    END IF;

    -- 1. Authorize access to the callback location.
    SELECT t.location_id INTO v_location
    FROM callback_tasks t
    WHERE t.organization_id = p_org_id AND t.id = p_task_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT 404, jsonb_build_object('error', 'not_found');
        RETURN;
    END IF;

    PERFORM 1 FROM location_memberships m
    WHERE m.organization_id = p_org_id AND m.location_id = v_location
      AND m.user_id = p_user_id AND m.active
    FOR SHARE;
    IF NOT FOUND THEN
        RETURN QUERY SELECT 403, jsonb_build_object('error', 'forbidden');
        RETURN;
    END IF;

    -- 2. Reserve this user-scoped request key.
    INSERT INTO claim_requests (organization_id, user_id, request_key, task_id)
    VALUES (p_org_id, p_user_id, p_request_key, p_task_id)
    ON CONFLICT (organization_id, user_id, request_key) DO NOTHING
    RETURNING request_key INTO v_inserted;

    -- 3. Replay a completed request after checking its payload.
    IF v_inserted IS NULL THEN
        SELECT r.* INTO STRICT v_saved
        FROM claim_requests r
        WHERE r.organization_id = p_org_id AND r.user_id = p_user_id
          AND r.request_key = p_request_key;
        IF v_saved.task_id <> p_task_id THEN
            RETURN QUERY SELECT 422, jsonb_build_object('error', 'key_reused');
            RETURN;
        END IF;
        IF v_saved.response_status IS NULL THEN
            RAISE EXCEPTION 'Incomplete request record';
        END IF;
        RETURN QUERY SELECT v_saved.response_status, v_saved.response_body;
        RETURN;
    END IF;

    -- 4. Compete for ownership with one conditional update.
    UPDATE callback_tasks
    SET status = 'claimed', assigned_user_id = p_user_id
    WHERE organization_id = p_org_id AND id = p_task_id
      AND status = 'unclaimed'
    RETURNING id INTO v_claimed;

    IF v_claimed IS NOT NULL THEN
        v_status := 200;
        v_body := jsonb_build_object('task_id', p_task_id, 'assigned_user_id', p_user_id);
    ELSE
        v_status := 409;
        v_body := jsonb_build_object('error', 'already_claimed', 'task_id', p_task_id);
    END IF;

    -- 5. Save the outcome in the same transaction as the claim.
    UPDATE claim_requests
    SET response_status = v_status, response_body = v_body
    WHERE organization_id = p_org_id AND user_id = p_user_id
      AND request_key = p_request_key;
    RETURN QUERY SELECT v_status, v_body;
END;
$$;
```

**Why `VOLATILE`?** This function changes data and performs separate statements whose snapshots matter. PostgreSQL documents a fresh snapshot for each query executed by a volatile function. At Read Committed, the replay lookup can therefore see a reservation that committed while its preceding insert waited. This is different from trying to combine the conflicting insert and fallback read in one statement. [Function volatility](https://www.postgresql.org/docs/18/xfunc-volatility.html)

The example caches 200 and 409 outcomes. Invalid keys, missing tasks, and failed access checks are preconditions and are not cached. A key reused for another accessible task returns 422 without replacing the original result. The request table is dedicated to this operation, so the task ID is the variable payload being compared. A broader endpoint would need to compare all meaningful fields and the operation identity.

### Fictional seed data

These rows give Alice access to North and South, Bob access to North, and neither access to the other organization. Sam and Pat share a phone number. The fixture supplies tasks 77, 78, and 79.

```sql
INSERT INTO organizations VALUES(1,'Example Clinics'),(2,'Other Clinics');
INSERT INTO app_users VALUES(101,'Alice'),(202,'Bob');
INSERT INTO locations VALUES(1,10,'North'),(1,20,'South'),(2,30,'West');
INSERT INTO location_memberships VALUES(1,10,101,'receptionist',true),(1,20,101,'receptionist',true),(1,10,202,'receptionist',true);
INSERT INTO provider_accounts VALUES(1,1,'example','account-one'),(2,2,'example','account-two');
INSERT INTO contacts VALUES(1,1,'Sam Example'),(1,2,'Pat Example');
INSERT INTO contact_phones VALUES(1,1,'+12025550100'),(1,2,'+12025550100');
INSERT INTO calls VALUES(1,1,10,1,'call-one','+12025550100',now(),'missed',1),(1,2,20,1,'call-two','+12025550100',now(),'missed',1),(2,3,30,2,'call-three','+12025550100',now(),'missed',1);
INSERT INTO callback_tasks(organization_id,id,location_id,call_id) VALUES(1,77,10,1),(1,78,20,2),(2,79,30,3);
```

### Complete Python caller

Install the pinned dependency:

```bash
python -m pip install 'psycopg[binary]==3.3.8'
```

This is the complete `claim.py`. The connection starts in autocommit mode so the explicit transaction block owns the transaction rather than accidentally becoming a savepoint inside an existing one. Leaving that block commits; an exception rolls it back. The result leaves the function only after commit succeeds.

Values are bound through `%s` parameters, not interpolated into the SQL text. Psycopg decodes the returned JSON into a Python object. [Psycopg transactions](https://www.psycopg.org/psycopg3/docs/basic/transactions.html#transaction-contexts), [parameter binding](https://www.psycopg.org/psycopg3/docs/basic/params.html).

```python
import json
import os
import psycopg


def claim_callback(dsn, organization_id, user_id, task_id, request_key):
    # The service supplies authenticated identity and authorized tenant context.
    with psycopg.connect(dsn, autocommit=True) as conn:
        conn.isolation_level = psycopg.IsolationLevel.READ_COMMITTED
        with conn.transaction():
            result = conn.execute(
                'SELECT * FROM claim_callback(%s, %s, %s, %s)',
                (organization_id, user_id, task_id, request_key),
            ).fetchone()
        # Commit has succeeded before this outcome leaves the function.
        return result


if __name__ == '__main__':
    dsn = os.environ['DATABASE_URL']
    for user, key in [(101, 'alice-claim-01'), (202, 'bob-claim-01'), (101, 'alice-claim-01')]:
        print(json.dumps(claim_callback(dsn, 1, user, 77, key)))
```

The caller returns an HTTP-style status and body, but this is a command-line database example, not an HTTP server or a login system. The same stored function can also be invoked directly:

```sql
BEGIN ISOLATION LEVEL READ COMMITTED;

SELECT *
FROM claim_callback(1, 101, 77, 'alice-claim-01');

COMMIT;
```

### Predict the result, then run it

Before running the demo, predict these three outcomes: Alice claims task 77, Bob independently claims it, and Alice repeats her original key.

```text
[200, {"task_id": 77, "assigned_user_id": 101}]
[409, {"error": "already_claimed", "task_id": 77}]
[200, {"task_id": 77, "assigned_user_id": 101}]
```

The first response records a successful claim. The second records a competing user's conflict. The third reproduces Alice's original result without claiming again.

That sequential demonstration does not prove concurrency behavior. The repository also runs six tests against PostgreSQL 18. They check competing users waiting on a lock, a duplicate waiting for its original request, rollback, cached success and conflict replay, key misuse, location permissions, membership revocation, and cross-tenant foreign keys. Each test creates an isolated schema and removes it afterward.

The example implements the claim operation. Provider ingestion, real-time browser updates, contact matching, release, completion, and supervisor overrides are not implemented services.

## Try the reasoning in another system

**Before:**

```text
[Agent A] -- claim --> [Support ticket: unassigned]
[Agent B] -- claim --> [Same support ticket]
```

**Question:** What protects ownership when both agents claim the ticket, and what protects Agent A when a successful response is lost?

A guarded state transition resolves the two different claims. A scoped request identity and saved result let Agent A retry the same action. Moving from clinic callbacks to support tickets changes the domain labels, but preserves the two problems.

**After:**

```text
Different claims --> [Guarded transition] --> one owner
Same claim again --> [Saved request result] --> original outcome
```

The reusable habit is to identify the business rule first, then choose the database mechanism that enforces it.

## References

PostgreSQL's documentation connects [Read Committed updates](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED), [row-level locks](https://www.postgresql.org/docs/18/explicit-locking.html#LOCKING-ROWS), [unique-index conflict handling](https://www.postgresql.org/docs/18/index-unique-checks.html), and [relational constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) to the guarantees used here. Its [multicolumn-index guidance](https://www.postgresql.org/docs/18/indexes-multicolumn.html) explains why the filters and ordering determine index layout.

Psycopg's [transaction contexts](https://www.psycopg.org/psycopg3/docs/basic/transactions.html#transaction-contexts) and [parameter binding](https://www.psycopg.org/psycopg3/docs/basic/params.html) cover the Python boundary.

## Related topics

- [Databases at scale](../../topics/system-design/databases/): storage choices, indexes, and transactions.
- [API design](../../topics/system-design/api-design/): request contracts and idempotency.
- [Distributed locking](../../topics/system-design/distributed-locking/): coordinating work across processes.
- [Monolith to microservices, one boundary at a time](../2026-10-26-monolith-to-microservices-one-boundary-at-a-time/): keeping related database changes together before crossing service boundaries.

#SystemDesign #DataModeling #PostgreSQL #SQL #Python #DatabaseTransactions #ConcurrencyControl #RaceConditions #RowLocking #Atomicity #Idempotency #MultiTenancy #AccessControl #DistributedSystems

## Run the working repository

The [tested source revision](https://github.com/waggertron/postgres-callback-claims/tree/ae21a49822324000d556e4fc0ea269fb8f53bf09) contains the exact schema and Python shown above, fictional fixtures, Docker Compose setup, and concurrency tests.

With Docker and Compose installed:

```bash
git clone https://github.com/waggertron/postgres-callback-claims.git
cd postgres-callback-claims
git checkout ae21a49822324000d556e4fc0ea269fb8f53bf09

docker compose -p callback-claims up -d --wait db
docker compose -p callback-claims run --build --rm example
docker compose -p callback-claims run --rm example python -m unittest -v
```

The database persists between commands. To remove this example's containers and disposable database volume, or reset before another run:

```bash
docker compose -p callback-claims down -v --remove-orphans
```

[Full working example on GitHub](https://github.com/waggertron/postgres-callback-claims)
