---
title: n8n, workflow automation from novice to expert
description: "Definition, mental models, workflow JSON examples for support, revenue, and DevOps use cases, plus exact local, cloud VM, n8n Cloud, and production queue-mode hosting configurations."
category: ops
tags: [n8n, automation, workflow-automation, self-hosting, integrations]
status: draft
created: 2026-07-22
updated: 2026-07-22
---

n8n is where workflow automation crosses from "connect two apps" into "operate a small integration system." It can run as a hosted product, a single Docker container on a laptop, a Docker Compose stack on a VM, or a queue-backed deployment with PostgreSQL, Redis, workers, and Kubernetes.

The public repos worth pointing readers to are the [n8n source repository](https://github.com/n8n-io/n8n), the official [n8n-hosting examples](https://github.com/n8n-io/n8n-hosting), and the [self-hosted AI starter kit](https://github.com/n8n-io/self-hosted-ai-starter-kit). If you publish your own example repo, commit workflow JSON and `.env.example`, never real `.env` files or credential exports.

## Level 1: Novice

**n8n is a workflow automation platform.** A workflow starts when something happens, then runs connected nodes in order. A node can receive a webhook, call an API, transform JSON, branch on a condition, wait for a human, write to a database, send a message, or run JavaScript and Python when the visual nodes are not enough.

The small mental model:

```text
trigger -> node -> node -> branch -> node
        JSON items move between each step
```

Core terms:

- **Workflow**: The saved automation graph.
- **Trigger**: The first node. Examples: webhook, schedule, email inbox, form submission, database event.
- **Node**: One action in the graph.
- **Item**: One JSON object moving through the workflow.
- **Expression**: A dynamic value such as `{{ $json.email }}` that reads data from previous nodes.
- **Credential**: A stored connection secret for a service. Keep these in n8n, not in workflow JSON.
- **Execution**: One run of a workflow, with logs and output data.

n8n is useful when the hard part is not writing one function. The hard part is moving data across services reliably, mapping fields, retrying failures, and letting non-backend engineers inspect the flow.

## Level 2: Beginner

Start locally with Docker. This gives you a private editor at `http://localhost:5678` and stores data in a Docker volume.

```bash
docker volume create n8n_data

docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE=America/Los_Angeles \
  -e TZ=America/Los_Angeles \
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Open `http://localhost:5678`, create the owner account, then import one of the JSON workflows below:

1. Open the workflow menu in the editor.
2. Choose **Import from File**.
3. Paste the JSON into a file such as `support-triage.json`.
4. Select **Execute Workflow** so the test webhook listens.
5. Call `/webhook-test/<path>` while testing. After publishing, call `/webhook/<path>`.

The first workflow receives a support ticket, classifies the priority, and returns the normalized ticket. It uses only core nodes, so it works without external credentials.

```json
{
  "name": "Support intake triage",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "support-triage",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "0f7b7cf1-1560-4d85-8f02-6a5862fa21b1",
      "name": "Support Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const input = $json.body ?? $json;\nconst text = `${input.subject ?? \"\"} ${input.message ?? \"\"}`;\nconst priority = /refund|urgent|down|broken|blocked|cannot|failed/i.test(text) ? \"high\" : /question|how|where|when/i.test(text) ? \"normal\" : \"low\";\nreturn [{ json: { ticketId: input.ticketId ?? \"new\", customer: input.customer ?? \"unknown\", priority, queue: priority === \"high\" ? \"support-escalation\" : \"support\", summary: String(input.message ?? \"\").slice(0, 160) } }];"
      },
      "id": "8f596068-a452-4463-8367-162377e6f2be",
      "name": "Classify Ticket",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [520, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "id": "e6494ba4-414f-41f5-9b6b-845b37a6a64c",
      "name": "Return Triage",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [800, 300]
    }
  ],
  "connections": {
    "Support Webhook": {
      "main": [[{ "node": "Classify Ticket", "type": "main", "index": 0 }]]
    },
    "Classify Ticket": {
      "main": [[{ "node": "Return Triage", "type": "main", "index": 0 }]]
    }
  },
  "settings": { "executionOrder": "v1" },
  "pinData": {}
}
```

Test it:

```bash
curl -X POST http://localhost:5678/webhook-test/support-triage \
  -H 'Content-Type: application/json' \
  -d '{"ticketId":"T-100","customer":"Acme","subject":"Checkout is down","message":"Customers cannot pay after the deploy"}'
```

## Level 3: Intermediate

Real n8n work is mostly field mapping and routing. These three examples use the same import and test flow, but each domain has a different decision boundary.

### Customer support

Use n8n when inbound messages need to be normalized before they hit Zendesk, Freshdesk, Jira Service Management, Slack, or email. The safe pattern is: receive input, classify it, write a structured object, then let a credential-backed service node create the ticket.

```text
Webhook -> Code classifier -> helpdesk or Slack node
```

The support triage workflow above is the runnable core. In production, replace **Return Triage** with a helpdesk node and use the returned fields:

- `priority` maps to the helpdesk priority.
- `queue` maps to the team or Slack channel.
- `summary` maps to the ticket body.

### Revenue operations

This workflow scores a lead and decides whether it goes to sales, nurture, or self-serve. It is useful for HubSpot, Salesforce, Pipedrive, Airtable, and Google Sheets style workflows.

```json
{
  "name": "Revenue lead scoring",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-score",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "3d7592b0-2f3b-40aa-8d39-df22a81275e4",
      "name": "Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const lead = $json.body ?? $json;\nconst employees = Number(lead.employees ?? 0);\nconst budget = Number(lead.budgetUsd ?? 0);\nconst hasWorkEmail = /@/.test(String(lead.email ?? \"\")) && !/(gmail|yahoo|hotmail)\\.com$/i.test(String(lead.email ?? \"\"));\nconst score = (employees >= 100 ? 40 : employees >= 20 ? 25 : 10) + (budget >= 50000 ? 35 : budget >= 10000 ? 20 : 5) + (hasWorkEmail ? 15 : 0) + (lead.requestedDemo ? 10 : 0);\nconst route = score >= 75 ? \"sales\" : score >= 40 ? \"nurture\" : \"self-serve\";\nreturn [{ json: { email: lead.email ?? \"unknown\", company: lead.company ?? \"unknown\", score, route, nextStep: route === \"sales\" ? \"Create sales task\" : route === \"nurture\" ? \"Add to education sequence\" : \"Send product docs\" } }];"
      },
      "id": "664beec4-3877-4d45-8d9a-dddd333495b7",
      "name": "Score Lead",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [520, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "id": "f246e78c-3208-44d9-8af7-503c8319f42c",
      "name": "Return Score",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [800, 300]
    }
  ],
  "connections": {
    "Lead Webhook": {
      "main": [[{ "node": "Score Lead", "type": "main", "index": 0 }]]
    },
    "Score Lead": {
      "main": [[{ "node": "Return Score", "type": "main", "index": 0 }]]
    }
  },
  "settings": { "executionOrder": "v1" },
  "pinData": {}
}
```

Test it:

```bash
curl -X POST http://localhost:5678/webhook-test/lead-score \
  -H 'Content-Type: application/json' \
  -d '{"email":"buyer@example.test","company":"Example Co","employees":140,"budgetUsd":75000,"requestedDemo":true}'
```

### DevOps and SRE

This workflow receives deployment events, computes severity, and returns an incident payload. In a real stack, the last node is usually Slack, PagerDuty, GitHub Issues, Jira, or an internal incident API.

```json
{
  "name": "Deployment incident router",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "deployment-event",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "1c3c062b-9681-4478-b022-c1fe02e5067c",
      "name": "Deployment Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const event = $json.body ?? $json;\nconst failed = String(event.status ?? \"\").toLowerCase() !== \"success\";\nconst prod = String(event.environment ?? \"\").toLowerCase() === \"production\";\nconst severity = !failed ? \"info\" : prod ? \"sev2\" : \"sev3\";\nconst notify = severity === \"sev2\" ? [\"on-call\", \"release-manager\"] : failed ? [\"release-manager\"] : [];\nreturn [{ json: { service: event.service ?? \"unknown\", version: event.version ?? \"unknown\", environment: event.environment ?? \"unknown\", severity, notify, message: failed ? `Deployment failed for ${event.service ?? \"unknown\"}` : `Deployment succeeded for ${event.service ?? \"unknown\"}` } }];"
      },
      "id": "f77230e9-ec4b-4b44-a0e5-fd566fb9ded8",
      "name": "Classify Deployment",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [520, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}",
        "options": {}
      },
      "id": "9c4e3e87-e3d6-455c-a085-180449a74984",
      "name": "Return Incident Payload",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [800, 300]
    }
  ],
  "connections": {
    "Deployment Webhook": {
      "main": [[{ "node": "Classify Deployment", "type": "main", "index": 0 }]]
    },
    "Classify Deployment": {
      "main": [[{ "node": "Return Incident Payload", "type": "main", "index": 0 }]]
    }
  },
  "settings": { "executionOrder": "v1" },
  "pinData": {}
}
```

Test it:

```bash
curl -X POST http://localhost:5678/webhook-test/deployment-event \
  -H 'Content-Type: application/json' \
  -d '{"service":"checkout-api","version":"2026.07.22.1","environment":"production","status":"failed"}'
```

## Level 4: Advanced

At this level, the question changes from "can I build the workflow?" to "where should this run?"

| Hosting option | Use it when | Main tradeoff |
| --- | --- | --- |
| Local Docker | Learning, demos, private experiments | Not reachable by external services unless you add a tunnel |
| Cloud VM with Docker Compose | Small production workloads, private self-hosting | You own backups, upgrades, TLS, and monitoring |
| n8n Cloud | You want n8n to own hosting | Less infrastructure control |
| Queue mode | Production workloads with meaningful execution volume | More moving parts: PostgreSQL, Redis, workers, task runners |
| Kubernetes and Helm | Platform team already runs Kubernetes | Chart, secrets, ingress, storage, and autoscaling discipline required |

### Local configuration

Use SQLite only for learning and small single-instance use. Keep the Docker volume. It contains the default SQLite database and other instance data.

```bash
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

For local PostgreSQL testing, use Compose:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      GENERIC_TIMEZONE: ${GENERIC_TIMEZONE}
      TZ: ${GENERIC_TIMEZONE}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:
```

`.env`:

```text
N8N_VERSION=<tested_n8n_version>
POSTGRES_PASSWORD=<replace_with_database_password>
N8N_ENCRYPTION_KEY=<replace_with_long_random_value>
GENERIC_TIMEZONE=America/Los_Angeles
```

Generate the secret values locally:

```bash
openssl rand -base64 32
```

### Cloud VM configuration

For a small public instance, use a dedicated subdomain, Caddy for HTTPS, PostgreSQL for persistence, and an external task runner for code nodes.

DNS:

```text
Type: A
Name: n8n
Value: <your_server_ip>
```

`Caddyfile`:

```text
{$N8N_HOST} {
  reverse_proxy n8n:5678
}
```

`compose.yaml`:

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      N8N_HOST: ${N8N_HOST}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_HOST: ${N8N_HOST}
      N8N_PORT: 5678
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://${N8N_HOST}/
      N8N_PROXY_HOPS: 1
      N8N_EDITOR_BASE_URL: https://${N8N_HOST}
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_RUNNERS_MODE: external
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_BROKER_LISTEN_ADDRESS: 0.0.0.0
      GENERIC_TIMEZONE: ${GENERIC_TIMEZONE}
      TZ: ${GENERIC_TIMEZONE}
    volumes:
      - n8n_data:/home/node/.n8n
      - ./local-files:/files
    depends_on:
      - postgres

  n8n-runner:
    image: n8nio/runners:${N8N_VERSION}
    restart: unless-stopped
    environment:
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n:5679
    depends_on:
      - n8n

volumes:
  caddy_data:
  caddy_config:
  postgres_data:
  n8n_data:
```

`.env`:

```text
N8N_VERSION=<tested_n8n_version>
N8N_HOST=n8n.example.com
POSTGRES_PASSWORD=<replace_with_database_password>
N8N_ENCRYPTION_KEY=<replace_with_long_random_value>
RUNNERS_AUTH_TOKEN=<replace_with_long_random_value>
GENERIC_TIMEZONE=America/Los_Angeles
```

Start it:

```bash
mkdir -p local-files
docker compose up -d
docker compose logs -f n8n
```

The `WEBHOOK_URL` and `N8N_PROXY_HOPS` values matter. Without them, n8n can build webhook URLs from its internal port `5678` instead of the public HTTPS URL exposed by the proxy.

### Paid n8n Cloud configuration

n8n Cloud is the paid service-hosted path. You do not configure Docker, ports, TLS, PostgreSQL, Redis, or reverse proxies.

Use this setup:

1. Create an instance at `app.n8n.cloud`.
2. In the Cloud dashboard, open **Manage** and set the timezone.
3. In the editor, import workflow JSON from a file or URL.
4. Add credentials through the UI for Slack, Google, HubSpot, GitHub, OpenAI, or whatever service the workflow uses.
5. Publish workflows that must run from triggers or production webhooks.
6. Use the production webhook URL shown by the Webhook node.

The tradeoff is control. n8n Cloud plans do not expose custom environment variables, custom ports, reverse proxy settings, database backend selection, queue mode settings, or worker tuning. That is the point: n8n runs the infrastructure, and you configure workflows.

### Public repo layout

A repo meant for public examples should look like this:

```text
n8n-workflow-examples/
├── README.md
├── workflows/
│   ├── support-triage.json
│   ├── revenue-lead-scoring.json
│   └── deployment-incident-router.json
└── deploy/
    ├── compose.yaml
    ├── Caddyfile
    └── .env.example
```

Do not commit credential exports. Do not commit `.env`. The official source control feature can push workflow JSON, tags, variable stubs, and credential stubs, but n8n recommends private repositories unless the stubs are safe to expose.

## Level 5: Expert

Queue mode is the line between "n8n as a service" and "n8n as a distributed system."

```text
          browser, API, test webhooks
                    |
                 main n8n
                    |
              Redis job queue
                    |
          +---------+---------+
          |                   |
       worker              worker
          |                   |
          +---------+---------+
                    |
              PostgreSQL state
```

Use queue mode when executions are long-running, bursty, or business-critical enough that a single process is too fragile. It requires PostgreSQL and Redis. All main, worker, and webhook processor processes need the same `N8N_ENCRYPTION_KEY` so they can read credentials from the database.

`compose.queue.yaml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      EXECUTIONS_MODE: queue
      QUEUE_BULL_REDIS_HOST: redis
      QUEUE_HEALTH_CHECK_ACTIVE: "true"
      OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS: "true"
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_RUNNERS_MODE: external
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_BROKER_LISTEN_ADDRESS: 0.0.0.0
      N8N_HOST: ${N8N_HOST}
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://${N8N_HOST}/
      N8N_PROXY_HOPS: 1
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
      - redis

  n8n-runner:
    image: n8nio/runners:${N8N_VERSION}
    restart: unless-stopped
    environment:
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n:5679
    depends_on:
      - n8n

  n8n-worker:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    command: worker --concurrency=5
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      EXECUTIONS_MODE: queue
      QUEUE_BULL_REDIS_HOST: redis
      QUEUE_HEALTH_CHECK_ACTIVE: "true"
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_RUNNERS_MODE: external
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_BROKER_LISTEN_ADDRESS: 0.0.0.0
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
      - redis

  n8n-worker-runner:
    image: n8nio/runners:${N8N_VERSION}
    restart: unless-stopped
    environment:
      N8N_RUNNERS_AUTH_TOKEN: ${RUNNERS_AUTH_TOKEN}
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n-worker:5679
    depends_on:
      - n8n-worker

volumes:
  postgres_data:
  redis_data:
  n8n_data:
```

Kubernetes teams should start from the official Helm chart instead of hand-writing everything:

```bash
helm install n8n oci://ghcr.io/n8n-io/n8n-helm-chart/n8n \
  --version <chart_version> \
  -f values.yaml
```

Minimal queue-mode values:

```yaml
queueMode:
  enabled: true
  workerReplicaCount: 2
  workerConcurrency: 5

database:
  type: postgresdb
  useExternal: true
  host: "<postgres_host>"
  port: 5432
  database: n8n
  schema: "public"
  user: n8n
  passwordSecret:
    name: "n8n-db-secret"
    key: "password"

redis:
  enabled: true
  useExternal: true
  host: "<redis_host>"
  port: 6379

secretRefs:
  existingSecret: "n8n-core-secrets"

taskRunners:
  enabled: true
  authToken:
    existingSecret: "n8n-runner-token"
    existingSecretKey: "auth-token"
```

Production checklist:

- Pin `N8N_VERSION` or the Helm chart version. Do not float production on `latest`.
- Back up PostgreSQL and the `.n8n` volume or explicitly manage `N8N_ENCRYPTION_KEY`.
- Put `WEBHOOK_URL`, `N8N_HOST`, `N8N_PROTOCOL`, and `N8N_PROXY_HOPS` under change control.
- Route production webhook paths to webhook processors when volume grows.
- Keep test webhook paths on the main process.
- Use S3-compatible external storage for binary data in queue mode.
- Run `n8n audit` or the security audit endpoint as part of periodic review.
- Treat source control as promotion, not backup. Export workflows and database backups separately.

Licensing is part of expert design. Self-hosting your own internal workflows is different from hosting workflows and credentials for clients or embedding n8n inside your own product. Check n8n's current license guidance before offering n8n as part of a customer-facing service.

## References

- **n8n official docs and repos**: [main source repo](https://github.com/n8n-io/n8n), [Docker image README](https://github.com/n8n-io/n8n/tree/master/docker/images/n8n), [n8n-hosting examples](https://github.com/n8n-io/n8n-hosting), [Docker installation](https://docs.n8n.io/hosting/installation/docker/), [Docker Compose hosting](https://docs.n8n.io/hosting/installation/server-setups/docker-compose/), [environment variables](https://docs.n8n.io/hosting/configuration/environment-variables/deployment/), [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/), [reverse proxy webhook URL configuration](https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/), and [workflow import/export](https://docs.n8n.io/workflows/export-import/).
- **n8n Cloud and governance**: [n8n Cloud docs](https://docs.n8n.io/manage-cloud/overview/), [Cloud workflow downloads](https://docs.n8n.io/manage-cloud/download-workflows/), [source control environments](https://docs.n8n.io/source-control-environments/create-environments/), [Cloud plan features](https://support.n8n.io/article/n-8-n-cloud-subscription-features-per-tier), and [license guidance](https://support.n8n.io/article/can-i-use-your-license-for-my-use-case).
- **Public example repos**: [n8n self-hosted AI starter kit](https://github.com/n8n-io/self-hosted-ai-starter-kit) for a larger Compose stack with n8n, PostgreSQL, Qdrant, and Ollama.

## Related topics

- [Docker](../docker/), for images, volumes, Compose, and container lifecycle.
- [Kubernetes](../kubernetes/), for pods, services, ingress, persistent volumes, and workload scaling.
- [Helm](../helm/), for chart-driven Kubernetes deployment.
- [Tokens, Keys, Secrets, and Environment Variables](../secrets-keys-tokens/), for keeping n8n credentials and config out of public repos.
- [Message Queues](../../system-design/message-queues/), for the Redis-backed queue-mode mental model.
