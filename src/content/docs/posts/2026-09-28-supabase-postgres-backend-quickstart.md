---
title: "Supabase: a Postgres backend, with a working quick start"
description: "What Supabase replaces, its strengths and limits, comparisons with Firebase, Appwrite, and Convex, and a complete private notes app with authentication and database authorization."
date: 2026-09-28
tags: [supabase, postgres, backend, authentication, javascript]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-09-28-supabase-postgres-backend-quickstart/
---

A notes app sounds small until every note needs an owner. Now it needs accounts, sign-in, persistent storage, an API, and a rule that stops one user from reading another user's notes. Add attachments and live updates, and the infrastructure starts to outweigh the feature.

Supabase packages much of that infrastructure around PostgreSQL. You define the data model and access rules, then call its services from your application. The payoff is less plumbing between an idea and a working product. The tradeoff is that database design and authorization become application development skills from the beginning.

The quick start below builds that private notes app. It runs locally, uses real Supabase Auth and PostgreSQL, and supports creating, reading, editing, and deleting notes. No cloud account is required.

## What problem does Supabase solve?

In a conventional backend, a simple request crosses code you maintain: a route, authentication middleware, validation, authorization, a database query, and response formatting. Much of that code repeats across resources.

Supabase provides a backend as a service, or BaaS: a set of application services you use through APIs. Its [architecture](https://supabase.com/docs/guides/getting-started/architecture) combines PostgreSQL with Auth, a generated REST API through PostgREST, Realtime, Storage, and Edge Functions. You can use the hosted platform or operate the open source stack yourself.

For ordinary data access, the request path looks like this:

```text
Browser or mobile app
  |
  +--> Auth ----------------------> user session
  |
  +--> Data API + user token -----> PostgreSQL
  |                                  |
  |                                  +--> grants and row policies
  |                                  +--> constraints and queries
  |
  +--> Storage -------------------> files and access policies
  |
  +--> Edge Function -------------> custom server logic
```

The browser calls an HTTP API. It does not receive a database password or open a direct PostgreSQL connection. The platform handles the request infrastructure, but you still decide what data exists, who can access it, and which actions belong on a trusted server.

For example, saving a private draft can go through the generated API. Charging a customer belongs behind server logic that validates the purchase and calls the payment provider. Supabase removes many routine endpoints without removing the need for backend reasoning.

## What makes it distinctive?

### PostgreSQL remains the center

Every project includes a [full PostgreSQL database](https://supabase.com/docs/guides/database/overview). Tables, foreign keys, joins, transactions, indexes, SQL tools, and ordinary database connections remain available. An application can use the client SDK for a screen and a custom server with a PostgreSQL driver for another workflow.

This matters when a product grows from users and notes into teams, memberships, billing records, and reports. Relationships and constraints can stay in the database instead of becoming conventions spread across application code.

PostgreSQL also gives you an extension ecosystem. Supabase exposes supported extensions including [pgvector, PostGIS, and pg_cron](https://supabase.com/docs/guides/database/extensions), covering vector search, geographic queries, and scheduled database work. These are PostgreSQL capabilities made convenient by the platform, rather than inventions unique to Supabase.

### Authentication and database authorization connect

Auth establishes identity. PostgreSQL row level security, abbreviated RLS, decides which rows that identity can use. A private notes policy can express “the authenticated user's ID equals this row's owner.” The database applies that rule even if someone changes the browser code or sends a request directly.

SQL grants and RLS have separate jobs: a grant permits an operation on a table, and a policy restricts the eligible rows. Enabling RLS without an applicable policy blocks ordinary API access. The [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security) explains how these controls interact.

The practical benefit is a shared authorization boundary for clients using the Data API. The practical cost is that these policies deserve the same review and tests as server authorization code.

### Realtime and Storage share the platform

[Realtime](https://supabase.com/docs/guides/realtime) has three different uses: Postgres Changes delivers database change events, Broadcast carries application messages, and Presence tracks connected participants. A notification feed, a shared cursor, and an online indicator need different pieces of that system.

Subscriptions are not an offline database or a conflict resolution algorithm. An app still needs to reconnect, fetch current state, and decide how concurrent edits behave. [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes) also requires enabling the relevant tables for replication and has authorization and throughput considerations.

Storage adds object uploads and downloads with [access policies backed by RLS](https://supabase.com/docs/guides/storage/security/access-control). That helps a profile image or private attachment use the same user identity as the rest of the application. Files themselves live in object storage, rather than becoming ordinary rows of file bytes in your application tables.

### There is a path beyond generated CRUD

[Edge Functions](https://supabase.com/docs/guides/functions) run custom server code, commonly TypeScript on a Deno-compatible runtime. They fit webhook handlers and integrations that need secrets. Database functions fit atomic operations close to the data. A separate backend remains an option when the runtime or workflow calls for it.

The local CLI runs the stack in containers and supports versioned SQL migrations. [Self-hosting](https://supabase.com/docs/guides/self-hosting) gives teams an operational alternative to the managed service. It also hands them upgrades, backups, monitoring, and recovery. Open source makes an exit possible, but migrating Auth, Storage, functions, and client integrations is still work.

## Where Supabase fits well

Supabase is a strong candidate for a small team building a relational application: a customer portal, booking system, internal tool, community product, or SaaS dashboard. These applications often need conventional accounts, structured data, file uploads, and a few custom workflows. Shipping those pieces together can save more time than choosing each service independently.

It also fits prototypes whose data model may become a real product. SQL migrations, constraints, and ownership rules provide a useful foundation when the prototype stops being disposable. An AI application that stores documents, permissions, and embeddings can benefit from keeping those relationships near its vector queries.

These are architectural recommendations, not benchmark claims. A team already comfortable with PostgreSQL gets more immediate value than a team hoping to avoid database design altogether.

## Where it is a weaker fit

**Offline editing as the primary experience** needs more than subscriptions. If users work disconnected for hours, your architecture needs a local store, queued writes, synchronization, and conflict handling. Supabase can participate, but those requirements need their own solution.

**Long or CPU-heavy jobs** need a suitable worker runtime. Video processing, large imports, and model inference should not be squeezed into request handlers. Hosted [Edge Function limits](https://supabase.com/docs/guides/functions/limits) distinguish CPU time, memory, and wall-clock duration. A queue plus dedicated workers can complement Supabase.

**Complex business workflows** reduce the amount of code generated CRUD can replace. Reserving inventory, collecting payment, and issuing a refund require transactional boundaries, retries, and idempotency. Several consecutive client API calls are not one database transaction. Put an atomic database operation in a function, and coordinate external side effects in server code.

**Specialized database requirements** need evaluation beyond the platform's feature list. A warehouse query over years of events, or a globally distributed write workload, has different requirements from a regional transactional application. PostgreSQL performance still depends on schemas, indexes, query plans, connection management, and capacity.

**A team that only needs hosted PostgreSQL** may gain little from the bundle. Compare database providers on the workload you actually have. Conversely, running all the Supabase services yourself solely to avoid a hosting bill can replace a subscription with substantial operational work.

Cost comparisons also need a workload. Supabase's [pricing](https://supabase.com/pricing) includes compute and usage dimensions such as storage, egress, active users, and realtime traffic. Estimate those alongside engineering time. A free plan is a starting allowance, not a forecast of production cost.

## The closest alternatives

The following comparison is a choice of programming and operating models. It does not rank providers by speed or cost, which requires a representative workload.

| Option | Center of the application | A reason to choose it | Tradeoff to examine |
| --- | --- | --- | --- |
| Supabase | PostgreSQL, generated APIs, and database policies | Relational data with integrated application services | SQL and authorization policy design become central |
| Firebase with Cloud Firestore | Documents, SDK queries, listeners, and Security Rules | Mobile or web apps that benefit from client persistence and offline writes | Model access patterns carefully instead of assuming SQL joins |
| Firebase SQL Connect | Cloud SQL for PostgreSQL with declared GraphQL operations and generated SDKs | A relational app within the Firebase ecosystem | Compare its declared operation model with Supabase's Data API and RLS |
| Appwrite | Integrated services with managed database APIs or native databases | Teams that prefer Appwrite's APIs, permissions, and service bundle | Choose a database product explicitly because their integration models differ |
| Convex | Reactive queries and transactional mutations written in TypeScript | Live application state with automatic query subscriptions | Application code adopts Convex's query and mutation model |
| Custom API plus PostgreSQL | Your server framework and database layer | Existing backend expertise or specialized domain workflows | You own API design, service integration, and operations |

### Supabase versus Firebase

Firestore is the closer comparison for a client application that needs managed persistence, auth, and live updates. Its [offline persistence](https://firebase.google.com/docs/firestore/manage-data/enable-offline) can cache data and synchronize local changes, with platform-specific defaults and configuration. That can be a deciding advantage for a mobile app with unreliable connectivity.

For an application full of related entities and reporting queries, Supabase's SQL model is often easier to work with. That is a data-model judgment, not a claim that Firestore cannot represent relationships.

Firebase also offers [SQL Connect](https://firebase.google.com/docs/sql-connect), a PostgreSQL service built on Cloud SQL with GraphQL schema and operation definitions, Firebase Auth integration, and generated client SDKs. “Firebase is NoSQL” is therefore an incomplete platform comparison. Compare Supabase against the Firebase product you would actually use.

### Supabase versus Appwrite

[Appwrite Databases](https://appwrite.io/docs/products/databases) includes TablesDB, DocumentsDB, and VectorsDB, as well as native PostgreSQL and MySQL options. Its managed APIs provide permissions and realtime integration. Its [native PostgreSQL](https://appwrite.io/docs/products/databases/postgresql) product exposes direct SQL connections.

The useful question is where you want application authorization and queries to live. Supabase's generated Data API and PostgreSQL policies form one integrated route. Appwrite offers its own managed API route and separate native database choices. Compare those specific paths, including their authentication and permission integration, rather than assuming a database engine alone makes two products equivalent.

### Supabase versus Convex

[Convex](https://docs.convex.dev/understanding/overview) centers the application on TypeScript query and mutation functions. Subscribed queries rerun when their dependencies change. Its [mutations execute as transactions](https://docs.convex.dev/database/writing-data), which gives a different default programming model from stitching together client requests.

Choose Convex when reactive query results and TypeScript backend functions match how you want to build. Choose Supabase when PostgreSQL, SQL tooling, and database access outside the application SDK carry more weight. Neither choice automatically solves offline conflict resolution or business workflow design.

### Supabase versus building your own backend

A Django, Rails, Express, or Go backend with PostgreSQL gives you an explicit service boundary. It can be the better choice when the team already has conventions for domain logic, jobs, authorization, and operations.

These approaches can coexist. You can use Supabase for Auth and the database while a custom API handles selected workflows. The question is how much reusable infrastructure the platform replaces in your application, and how much custom behavior remains.

## Quick start: private notes with real authorization

You need Node.js 22.12 or newer, npm, and a running Docker-compatible container engine. Allow time and disk space for the first image download. The example uses Vite and plain JavaScript so that no frontend framework knowledge is required.

### 1. Create the project

Run these commands in a new directory. The package versions are pinned so the example has a reproducible starting point.

```bash
mkdir supabase-notes
cd supabase-notes
npm init -y
npm pkg set type=module
npm pkg set scripts.dev="vite --host 127.0.0.1"
npm pkg set scripts.build="vite build"
npm install --save-exact @supabase/supabase-js@2.117.2
npm install --save-dev --save-exact supabase@2.118.0 vite@8.3.1
npx supabase init
```

In the generated `supabase/config.toml`, find the existing `[auth.email]` section and set `enable_confirmations = false`. This makes local sign-up return a session immediately. Edit the existing setting instead of adding a duplicate section. This tutorial setting belongs to the local project.

```bash
npx supabase start
npx supabase migration new create_notes
```

The [CLI guide](https://supabase.com/docs/guides/local-development/cli/getting-started) covers installation and local services. Keep commands in this project directory. Default endpoints include the API at `http://127.0.0.1:54321` and Studio at `http://127.0.0.1:54323`.

### 2. Create the table and its access rules

Open the generated `supabase/migrations/<timestamp>_create_notes.sql` file and replace its contents with:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index notes_owner_created_idx
  on public.notes (user_id, created_at desc, id desc);

alter table public.notes enable row level security;

revoke all on public.notes from anon, authenticated;
grant select, delete on public.notes to authenticated;
grant insert (body), update (body) on public.notes to authenticated;

create policy "Read own notes" on public.notes
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Create own notes" on public.notes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Edit own notes" on public.notes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Delete own notes" on public.notes
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

`user_id` comes from the authenticated request. Column grants allow the client to write only `body`, so it cannot supply a different owner or change the ID. RLS then checks ownership for each operation. The database constraint rejects blank or oversized notes even when a request bypasses the form.

Apply the migration to this local database:

```bash
npx supabase migration up --local
```

### 3. Connect the browser

Run `npx supabase status` and copy the **Publishable** key into a new `.env.local` file:

```text
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_LOCAL_PUBLISHABLE_KEY_HERE
```

Use the actual URL printed by the CLI if your ports differ. The placeholder above needs replacing. Add `.env.local`, `node_modules/`, and `dist/` to your project's `.gitignore`.

A [publishable key](https://supabase.com/docs/guides/getting-started/api-keys) is intended for browser use. It identifies the application, while the signed-in user's access token identifies the user. `VITE_` values are included in the browser bundle, so never put a secret key or legacy `service_role` key there. Those elevated keys bypass RLS.

### 4. Add the page

Create `index.html` in the project root:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Private notes</title>
    <style>
      body { max-width: 42rem; margin: 3rem auto; padding: 0 1rem;
        font: 1rem/1.5 system-ui; }
      label, input, textarea { display: block; }
      input, textarea { box-sizing: border-box; width: 100%; margin: .5rem 0; }
      button { margin: .25rem .5rem .25rem 0; padding: .5rem; }
      li { margin: 1rem 0; }
      [hidden] { display: none !important; }
    </style>
  </head>
  <body>
    <h1>Private notes</h1>
    <p id="status" role="status" aria-live="polite"></p>
    <form id="auth">
      <label>Email <input name="email" type="email" required autocomplete="username" /></label>
      <label>Password <input name="password" type="password" minlength="8"
        required autocomplete="current-password" /></label>
      <button name="mode" value="signin">Sign in</button>
      <button name="mode" value="signup">Create account</button>
    </form>
    <section id="workspace" hidden aria-label="Your notes">
      <p id="identity"></p>
      <button id="signout" type="button">Sign out</button>
      <button id="refresh" type="button">Refresh notes</button>
      <form id="add">
        <label>New note <textarea name="body" required maxlength="2000"></textarea></label>
        <button>Add note</button>
      </form>
      <p>The newest 100 notes appear below.</p>
      <ul id="notes"></ul>
    </section>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

### 5. Add authentication and CRUD

Create `main.js` beside `index.html`:

```javascript
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
const auth = document.querySelector('#auth');
const workspace = document.querySelector('#workspace');
const add = document.querySelector('#add');
const notes = document.querySelector('#notes');
const status = document.querySelector('#status');
let user = null;
let loadVersion = 0;
let busy = false;

async function run(action) {
  if (busy) return;
  busy = true;
  status.textContent = 'Working...';
  document.querySelectorAll('button').forEach(b => { b.disabled = true; });
  try {
    status.textContent = (await action()) ?? '';
  } catch (error) {
    status.textContent = error.message ?? 'Request failed. Try again.';
  } finally {
    busy = false;
    document.querySelectorAll('button').forEach(b => { b.disabled = false; });
  }
}

function checkedBody(value) {
  const body = value.trim();
  if (!body || [...body].length > 2000) {
    throw new Error('Use between 1 and 2000 characters.');
  }
  return body;
}

async function loadNotes() {
  const version = ++loadVersion;
  if (!user) return;
  const { data, error } = await db.from('notes')
    .select('id, body, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(100);
  if (version !== loadVersion) return;
  if (error) throw error;
  notes.replaceChildren();
  for (const note of data) {
    const row = document.createElement('li');
    const input = document.createElement('textarea');
    input.value = note.body;
    input.maxLength = 2000;
    input.setAttribute('aria-label', 'Edit note');
    const save = document.createElement('button');
    save.textContent = 'Save';
    save.onclick = () => run(async () => {
      const { error } = await db.from('notes')
        .update({ body: checkedBody(input.value) }).eq('id', note.id)
        .select('id').single();
      if (error) throw error;
      await loadNotes();
      return 'Saved.';
    });
    const remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.onclick = () => run(async () => {
      const { error } = await db.from('notes').delete().eq('id', note.id)
        .select('id').single();
      if (error) throw error;
      await loadNotes();
      return 'Deleted.';
    });
    save.disabled = remove.disabled = busy;
    row.append(input, save, remove);
    notes.append(row);
  }
}

auth.onsubmit = event => {
  event.preventDefault();
  const fields = new FormData(auth);
  const credentials = {
    email: fields.get('email').trim(),
    password: fields.get('password'),
  };
  const signup = event.submitter?.value === 'signup';
  void run(async () => {
    const { data, error } = signup
      ? await db.auth.signUp(credentials)
      : await db.auth.signInWithPassword(credentials);
    if (error) throw error;
    auth.reset();
    return data.session ? 'Signed in.' : 'Confirm your email, then sign in.';
  });
};

add.onsubmit = event => {
  event.preventDefault();
  void run(async () => {
    const body = checkedBody(new FormData(add).get('body'));
    const { error } = await db.from('notes').insert({ body });
    if (error) throw error;
    add.reset();
    await loadNotes();
    return 'Added.';
  });
};

document.querySelector('#signout').onclick = () => run(async () => {
  const { error } = await db.auth.signOut({ scope: 'local' });
  if (error) throw error;
  return 'Signed out.';
});
document.querySelector('#refresh').onclick = () => run(loadNotes);

db.auth.onAuthStateChange((_event, session) => {
  user = session?.user ?? null;
  ++loadVersion;
  notes.replaceChildren();
  add.reset();
  auth.hidden = Boolean(user);
  workspace.hidden = !user;
  document.querySelector('#identity').textContent = user?.email ?? '';
  // Defer SDK calls until the synchronous auth callback has returned.
  setTimeout(() => {
    loadNotes().catch(error => { status.textContent = error.message; });
  }, 0);
});
```

The [auth listener](https://supabase.com/docs/reference/javascript/auth-onauthstatechange) handles the initial session and subsequent sign-in changes. The SDK persists the browser session, so a reload can restore it. The callback schedules data fetching after it returns. A request counter stops an older response from repopulating the list after an account change.

The explicit owner filter helps the query use the index. RLS remains the authorization boundary if that filter is removed. Note text goes into a textarea's `value`, which displays markup as text. It never passes through `innerHTML`.

### 6. Run it and verify the behavior

```bash
npm run dev
```

Open the URL Vite prints, normally `http://127.0.0.1:5173`. Use the same hostname consistently because browser session storage is scoped to the origin.

1. Create an account with an address such as `alice@example.com` and a password of at least eight characters. Local email confirmation is disabled, so the notes area appears immediately.
2. Add a note, edit it, and click **Save**. Reload the page. The updated note should still appear.
3. Sign out. The notes area should disappear. Sign back in with the same credentials and confirm the note returns.
4. Open a private browser window and create `bob@example.com`. Bob should see an empty list and should be able to create his own note. Alice should still see only hers.
5. Delete a note, then reload. It should stay deleted. Try entering only spaces in a note and confirm the app rejects it.

This app refreshes after its own writes and when you click **Refresh notes**. It does not subscribe to changes from another window. That keeps the first exercise focused on Auth, CRUD, and row ownership.

The two-account check catches accidental sharing through the UI. A stronger authorization test uses each user's token to call the API directly: Bob's read, update, and delete requests targeting Alice's note should return no rows, while an attempt to assign `user_id` should fail the column permission check. Testing only as the Studio administrator does not prove user isolation.

### 7. Build and stop

In another terminal in the same project, verify the frontend production build:

```bash
npm run build
```

Stop Vite with Ctrl-C. Stop this project's Supabase services with:

```bash
npx supabase stop
```

The normal stop preserves local database state. For a disposable tutorial project, `npx supabase stop --no-backup` removes its local data instead. Run cleanup from the tutorial directory so it targets the intended project.

## Common quick-start failures

| Symptom | What to check |
| --- | --- |
| The local stack cannot start | Docker is running, sufficient memory is available, and the printed ports are free |
| Invalid API key or failed fetch | `.env.local` has the local URL and publishable key, and Vite was restarted after editing it |
| Sign-up says to confirm email | Edit the existing local `[auth.email]` setting, then stop and restart Supabase |
| The API cannot find `notes` | Run the migration against the same local project the browser uses |
| A signed-in user sees no rows | Confirm the user owns rows and the SELECT policy was applied. An empty result can be correct authorization behavior |
| An insert gets a permission error | Send only `body`, use a signed-in session, and check both column grants and the INSERT policy |
| Save reports that no single row was returned | The row was deleted elsewhere, or the current user no longer has access. Refresh the list |

## Taking the example to a hosted project

The local tutorial ends with a working app. Hosting it adds a separate environment. Create a Supabase project, then follow the [environment and migration workflow](https://supabase.com/docs/guides/deployment/managing-environments) to link that project and apply the SQL migration. Use that project's URL and publishable key when building the frontend, and deploy the resulting `dist/` directory to a static host.

Configure the hosted Auth site URL and redirect allowlist for that frontend. With email confirmation enabled, sign-up can succeed without an immediate session. Confirm the email and then use **Sign in**. Configure email delivery for real users using the [password Auth guide](https://supabase.com/docs/guides/auth/passwords).

A production notes product would also need password recovery, pagination beyond the newest 100 notes, and a decision about concurrent edits. Here, the last successful save wins. Review quotas, backup and restore procedures, and abuse controls against the actual product requirements. Those are additions to a functioning tutorial, not behavior this small app already provides.

Supabase is most compelling when your product benefits from PostgreSQL and you want the surrounding application services ready to use. The time saved on infrastructure is time you can spend on the data model, permissions, and behavior that make the product yours.

## References

- **Supabase platform**: [Architecture](https://supabase.com/docs/guides/getting-started/architecture), [database capabilities](https://supabase.com/docs/guides/database/overview), and [self-hosting](https://supabase.com/docs/guides/self-hosting) explain the platform boundary.
- **Application implementation**: The [local CLI guide](https://supabase.com/docs/guides/local-development/cli/getting-started), [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security), and [JavaScript API reference](https://supabase.com/docs/reference/javascript/introduction) support the tutorial.
- **Alternative programming models**: [Firebase SQL Connect](https://firebase.google.com/docs/sql-connect), [Firestore offline behavior](https://firebase.google.com/docs/firestore/manage-data/enable-offline), [Appwrite database choices](https://appwrite.io/docs/products/databases), and [Convex architecture](https://docs.convex.dev/understanding/overview).

## Related topics

- [MySQL vs PostgreSQL](../../topics/system-design/databases/mysql-vs-postgres/)
- [REST API design](../2026-04-24-rest-api-design/)
- [Stateless authentication](../2026-04-24-stateless-auth/)
