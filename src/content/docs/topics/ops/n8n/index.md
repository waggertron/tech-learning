---
title: n8n, workflow automation in five levels
description: "What n8n is, how workflows move data, three practical automation patterns, and how to choose local Docker, n8n Cloud, cloud VM, or production queue-mode hosting."
category: ops
tags: [n8n, automation, workflow-automation, self-hosting, integrations]
status: draft
created: 2026-07-22
updated: 2026-07-23
---

n8n is a workflow automation tool for connecting systems that were not built to talk to each other. A workflow can receive a form submission, look up data, transform fields, call an API, route the result, and notify a person without turning every small process into a custom backend service.

The useful way to think about n8n is not "no-code" or "low-code." It is an integration workbench. You use the visual canvas for the shape of the process, then use expressions or code when the data needs real logic.

Public repos worth bookmarking:

- [n8n](https://github.com/n8n-io/n8n), the main source repository.
- [n8n-hosting](https://github.com/n8n-io/n8n-hosting), official Docker Compose, Caddy, Kubernetes, Helm, and AWS hosting examples.
- [self-hosted AI starter kit](https://github.com/n8n-io/self-hosted-ai-starter-kit), a larger public example with n8n, PostgreSQL, Qdrant, and Ollama.

## Level 1: What n8n is

A workflow has a simple shape:

```text
something happens -> n8n receives data -> nodes transform or route it -> another system gets the result
```

Example:

```text
New support form
  -> classify the message
  -> decide the priority
  -> create a ticket
  -> notify the right channel
```

The pieces:

- **Workflow**: The saved automation.
- **Trigger**: The first step. It starts the workflow from a webhook, schedule, app event, form, chat message, or manual click.
- **Node**: One operation, such as HTTP request, filter, database lookup, Slack message, Google Sheets row, or code.
- **Item**: A JSON object moving through the workflow.
- **Expression**: A dynamic value read from earlier data, such as `{{ $json.email }}`.
- **Execution**: One run of the workflow, including input, output, and logs.

n8n is strongest when the work is mostly coordination. If the task is "run one pure algorithm," write code. If the task is "when this happens in one system, enrich it, decide what it means, and update three other systems," n8n is worth considering.

## Level 2: Build one workflow

Start with a webhook workflow because it makes the data path obvious. A webhook is a URL that accepts an HTTP request. n8n receives the request body as JSON, passes it into the next node, and returns a response.

```text
Webhook -> Code -> Respond to Webhook
```

Run n8n locally:

```bash
docker volume create n8n_data

docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE=America/Los_Angeles \
  -e TZ=America/Los_Angeles \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Open `http://localhost:5678`, create the owner account, then create this workflow:

1. Add a **Webhook** trigger.
2. Set method to `POST`.
3. Set path to `support-triage`.
4. Add a **Code** node.
5. Paste the JavaScript below.
6. Add **Respond to Webhook**.
7. Connect the three nodes.
8. Select **Execute Workflow** while testing.

Code node:

```javascript
const input = $json.body ?? $json;
const text = `${input.subject ?? ""} ${input.message ?? ""}`;

let priority = "low";
if (/refund|urgent|down|broken|blocked|cannot|failed/i.test(text)) {
  priority = "high";
} else if (/question|how|where|when/i.test(text)) {
  priority = "normal";
}

return [
  {
    json: {
      ticketId: input.ticketId ?? "new",
      customer: input.customer ?? "unknown",
      priority,
      route: priority === "high" ? "support-escalation" : "support",
      summary: String(input.message ?? "").slice(0, 160),
    },
  },
];
```

Test it:

```bash
curl -X POST http://localhost:5678/webhook-test/support-triage \
  -H 'Content-Type: application/json' \
  -d '{"ticketId":"T-100","customer":"Acme","subject":"Checkout is down","message":"Customers cannot pay after the deploy"}'
```

Expected response:

```json
{
  "ticketId": "T-100",
  "customer": "Acme",
  "priority": "high",
  "route": "support-escalation",
  "summary": "Customers cannot pay after the deploy"
}
```

During testing, n8n uses `/webhook-test/<path>`. After you publish the workflow, production callers use `/webhook/<path>`.

## Level 3: Three useful domains

The same pattern shows up in very different teams. The trigger changes. The system you update changes. The core work is still: receive data, normalize it, decide what happens next.

### Customer support: triage and escalation

Good fit:

- Route urgent customer messages to the right queue.
- Add context before a human sees the ticket.
- Convert inconsistent form fields into a stable ticket shape.

Workflow shape:

```text
Form or webhook
  -> normalize fields
  -> classify priority
  -> create helpdesk ticket
  -> notify escalation channel when needed
```

The Code node above is the core of this workflow. In a real version, the final node becomes Zendesk, Freshdesk, Jira Service Management, Slack, or email.

Avoid n8n for the actual customer conversation state machine if the product already has a dedicated support platform. Let the support tool own the case lifecycle. Let n8n move and enrich the intake.

### Revenue operations: score and route leads

Good fit:

- Score inbound leads before they hit a CRM.
- Route enterprise leads to sales and small leads to self-serve follow-up.
- Enrich a lead with data from a form, CRM, spreadsheet, or API.

Workflow shape:

```text
Lead webhook
  -> score lead
  -> choose route
  -> create CRM task or add to nurture list
```

Code node:

```javascript
const lead = $json.body ?? $json;

const employees = Number(lead.employees ?? 0);
const budget = Number(lead.budgetUsd ?? 0);
const email = String(lead.email ?? "");
const hasWorkEmail = /@/.test(email) && !/(gmail|yahoo|hotmail)\.com$/i.test(email);

let score = 0;
score += employees >= 100 ? 40 : employees >= 20 ? 25 : 10;
score += budget >= 50000 ? 35 : budget >= 10000 ? 20 : 5;
score += hasWorkEmail ? 15 : 0;
score += lead.requestedDemo ? 10 : 0;

let route = "self-serve";
if (score >= 75) {
  route = "sales";
} else if (score >= 40) {
  route = "nurture";
}

return [
  {
    json: {
      email,
      company: lead.company ?? "unknown",
      score,
      route,
      nextStep:
        route === "sales"
          ? "Create sales task"
          : route === "nurture"
            ? "Add to education sequence"
            : "Send product docs",
    },
  },
];
```

Test input:

```bash
curl -X POST http://localhost:5678/webhook-test/lead-score \
  -H 'Content-Type: application/json' \
  -d '{"email":"buyer@example.test","company":"Example Co","employees":140,"budgetUsd":75000,"requestedDemo":true}'
```

Expected response:

```json
{
  "email": "buyer@example.test",
  "company": "Example Co",
  "score": 100,
  "route": "sales",
  "nextStep": "Create sales task"
}
```

Avoid n8n as the source of truth for pipeline state. Put the durable record in the CRM. Use n8n to connect the intake, scoring, and handoff.

### Engineering operations: deployment event routing

Good fit:

- Turn CI/CD webhook events into team notifications.
- Escalate production failures differently from staging failures.
- Create incident payloads for Slack, PagerDuty, Jira, Linear, or GitHub Issues.

Workflow shape:

```text
Deployment webhook
  -> classify status and environment
  -> choose severity
  -> notify the right people
```

Code node:

```javascript
const event = $json.body ?? $json;

const status = String(event.status ?? "").toLowerCase();
const environment = String(event.environment ?? "").toLowerCase();
const failed = status !== "success";
const production = environment === "production";

const severity = !failed ? "info" : production ? "sev2" : "sev3";
const notify =
  severity === "sev2"
    ? ["on-call", "release-manager"]
    : failed
      ? ["release-manager"]
      : [];

return [
  {
    json: {
      service: event.service ?? "unknown",
      version: event.version ?? "unknown",
      environment: event.environment ?? "unknown",
      severity,
      notify,
      message: failed
        ? `Deployment failed for ${event.service ?? "unknown"}`
        : `Deployment succeeded for ${event.service ?? "unknown"}`,
    },
  },
];
```

Test input:

```bash
curl -X POST http://localhost:5678/webhook-test/deployment-event \
  -H 'Content-Type: application/json' \
  -d '{"service":"checkout-api","version":"2026.07.22.1","environment":"production","status":"failed"}'
```

Expected response:

```json
{
  "service": "checkout-api",
  "version": "2026.07.22.1",
  "environment": "production",
  "severity": "sev2",
  "notify": ["on-call", "release-manager"],
  "message": "Deployment failed for checkout-api"
}
```

Avoid n8n as the only incident record. A notification workflow is fine. Incident history belongs in the system your team already uses for incident management.

## Level 4: Choose hosting

Hosting is a product decision before it is an infrastructure decision.

| Option | Best for | You manage | You do not manage |
| --- | --- | --- | --- |
| Local Docker | Learning, demos, private experiments | Container lifecycle, local data | Public TLS, external availability |
| n8n Cloud | Most teams that want automation without ops work | Workflows, users, app connections | Servers, database, TLS, upgrades |
| Cloud VM with Compose | Small self-hosted production | VM, backups, upgrades, DNS, TLS | Kubernetes complexity |
| Queue mode | Higher-volume production | Database, Redis, workers, deployment topology | Single-process execution limits |
| Kubernetes with Helm | Platform teams already on Kubernetes | Chart values, ingress, storage, scaling | One-off Kubernetes manifests |

### Local Docker

Use this for learning. It is the quickest way to see the editor and test webhook workflows.

```bash
docker volume create n8n_data

docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE=America/Los_Angeles \
  -e TZ=America/Los_Angeles \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Local Docker is not a good public webhook host by itself. A third-party service cannot call `localhost` on your laptop. Use n8n Cloud, a public VM, or a tunnel while testing.

### Paid hosted service: n8n Cloud

Use n8n Cloud when the team wants to build workflows without owning runtime infrastructure.

Setup:

1. Create an n8n Cloud instance.
2. Set the workspace timezone from the Cloud dashboard.
3. Create or import workflows in the editor.
4. Add app connections in the UI.
5. Publish trigger-based workflows.
6. Use the production webhook URL shown in the Webhook node.

Cloud is the default recommendation for a broad audience because it removes the uninteresting work: TLS, database setup, version upgrades, and process supervision. The tradeoff is less low-level control. You configure workflows, not the server process.

### Cloud VM with Docker Compose

Use this when you want self-hosting without Kubernetes. The transferable setup is the architecture:

```text
DNS name
  -> HTTPS reverse proxy
  -> n8n container
  -> persistent database and file storage
```

Use the official hosting repository instead of copying deployment fragments from a blog post:

```bash
git clone https://github.com/n8n-io/n8n-hosting.git
cd n8n-hosting/docker-caddy
docker compose up -d
```

Before a VM becomes production, answer four questions:

- Who owns updates?
- Where are backups stored?
- How will failed workflow executions alert a person?
- Which URL will third-party webhooks call?

A cheap VM is still production once business workflows depend on it. If nobody owns those answers, use n8n Cloud.

## Level 5: Production design

Production n8n design is about blast radius. Ask these questions before adding more infrastructure:

- **Who notices failures?** If a workflow silently fails, does a human see it?
- **What retries are safe?** A retry that sends the same customer email twice is different from a retry that updates a spreadsheet.
- **Where is the durable record?** n8n can orchestrate work, but the source of truth should usually be a CRM, helpdesk, database, or incident system.
- **How many workflows can fail together?** One overloaded n8n instance can affect every automation it runs.
- **Who can change workflows?** Visual tools make change easy. Production systems still need review.

Queue mode is the scale-out pattern. One main process handles the editor, API, triggers, and scheduling. Redis holds pending work. Workers execute jobs. PostgreSQL stores workflow and execution state.

```text
UI, API, triggers
       |
    main n8n
       |
   Redis queue
       |
  workers
       |
 PostgreSQL
```

Use queue mode when workflows are long-running, bursty, or important enough that one process is not enough. Do not start there for a personal setup or a small team experiment.

Use the official queue-mode examples as the starting point:

```bash
git clone https://github.com/n8n-io/n8n-hosting.git
cd n8n-hosting/docker-compose/withPostgresAndWorker
docker compose up -d
```

For Kubernetes, use the official Helm chart rather than starting from raw manifests:

```bash
helm install n8n oci://ghcr.io/n8n-io/n8n-helm-chart/n8n \
  --version <chart_version> \
  -f values.yaml
```

That is the useful boundary for a broad article. It explains what each hosting model is for and points serious operators at the public templates that stay current.

## Public example repo shape

Keep public examples boring and safe:

```text
n8n-workflow-examples/
├── README.md
├── workflows/
│   ├── support-triage.md
│   ├── lead-scoring.md
│   └── deployment-routing.md
├── fixtures/
│   ├── support-ticket.json
│   ├── lead.json
│   └── deployment-event.json
└── hosting-notes.md
```

The workflow files can document node order, code-node JavaScript, test inputs, and expected outputs. That is more useful to a reader than a large exported JSON blob they cannot quickly scan. If the repo includes hosting notes, link to the official n8n templates instead of freezing private deployment choices into public example files.

## References

- **n8n official docs and repos**: [main source repo](https://github.com/n8n-io/n8n), [n8n-hosting examples](https://github.com/n8n-io/n8n-hosting), [Docker installation](https://docs.n8n.io/hosting/installation/docker/), [Docker Compose hosting](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/), [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/), [reverse proxy webhook URL configuration](https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/), and [workflow import/export](https://docs.n8n.io/workflows/export-import/).
- **n8n Cloud and governance**: [n8n Cloud docs](https://docs.n8n.io/manage-cloud/overview/), [Cloud workflow downloads](https://docs.n8n.io/manage-cloud/download-workflows/), [Cloud plan features](https://support.n8n.io/article/n-8-n-cloud-subscription-features-per-tier), and [license guidance](https://support.n8n.io/article/can-i-use-your-license-for-my-use-case).
- **Public examples**: [n8n self-hosted AI starter kit](https://github.com/n8n-io/self-hosted-ai-starter-kit) for a larger Compose stack with n8n, PostgreSQL, Qdrant, and Ollama.

## Related topics

- [Docker](../docker/), for images, volumes, Compose, and container lifecycle.
- [Kubernetes](../kubernetes/), for pods, services, ingress, persistent volumes, and workload scaling.
- [Helm](../helm/), for chart-driven Kubernetes deployment.
- [Message Queues](../../system-design/message-queues/), for the Redis-backed queue-mode mental model.
