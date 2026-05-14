---
title: Docker
description: "The container runtime that packages an application and everything it needs into an image, then runs that image as an isolated process. Build model, container lifecycle, networking, volumes, Compose, Dockerfile best practices, and where Docker fits in a Kubernetes world."
category: ops
tags: [docker, containers, devops, cloud-native]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

## The one-paragraph definition

**Docker is a platform for building and running containers.** A container is a process (or small group of processes) running in an isolated environment: its own filesystem, network namespace, and process tree, but sharing the host kernel. The key artifact is the image: a layered, read-only snapshot of a filesystem that can be built once and run identically on any machine with Docker installed.

Docker is not a virtual machine. Containers share the host kernel; VMs do not. That makes containers faster to start, cheaper to run, and smaller on disk. The tradeoff is weaker isolation.

## Architecture

Three pieces work together:

```
  Docker client (docker CLI or API)
        |
        |  REST API (Unix socket or TCP)
        v
  Docker daemon (dockerd)
  Manages images, containers, networks, volumes.
  Calls containerd underneath.
        |
        |  OCI runtime (runc)
        v
  Container processes (namespaces + cgroups)
```

- **Docker client**: the `docker` command. Sends API calls to the daemon.
- **Docker daemon**: manages the lifecycle of images and containers. Delegates actual container execution to `containerd` and `runc`.
- **Docker Hub / registry**: a repository of images. `docker pull nginx` fetches from Docker Hub by default.

## Images

An image is a stack of read-only layers. Each instruction in a `Dockerfile` adds a layer. When a container runs, a thin writable layer sits on top.

```
Container:  [ writable layer     ]
Image:      [ COPY . /app        ]  <- layer 4
            [ RUN pip install    ]  <- layer 3
            [ WORKDIR /app       ]  <- layer 2
            [ FROM python:3.12   ]  <- layer 1 (base)
```

This copy-on-write model means two images sharing a base layer use the base only once on disk, and a build that changes only the last layer reuses all earlier layers from cache.

### Dockerfile basics

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["gunicorn", "app:application", "--bind", "0.0.0.0:8000"]
```

The `COPY requirements.txt` before `COPY . .` is intentional: it caches the expensive install step as long as `requirements.txt` doesn't change.

### Image naming

```
registry/owner/name:tag
docker.io/library/nginx:1.25
ghcr.io/myorg/api:sha-abc1234
```

Omitting the registry defaults to Docker Hub. Omitting the tag defaults to `latest`. Pin to a specific tag or digest in production.

## Containers

A container is a running image instance. Key commands:

```bash
# run interactively, remove on exit
docker run -it --rm python:3.12 python

# run detached, name it, expose port, set env
docker run -d \
  --name api \
  -p 8000:8000 \
  -e DATABASE_URL=postgres://localhost/app \
  acme/api:latest

# tail logs
docker logs -f api

# shell into running container
docker exec -it api sh

# stop and remove
docker stop api && docker rm api
```

### Container lifecycle

```
Created -> Running -> Paused
               |
               +--> Stopped -> Removed
               |
               +--> (OOM killed or process exited)
```

Containers are ephemeral by design. Any state written to the container filesystem disappears when the container is removed. Persist state in volumes.

## Networking

Docker creates a virtual network per project. Four built-in drivers:

| Driver | What it gives you | When to use |
| --- | --- | --- |
| `bridge` | Isolated network, NAT to host | Default for single-host |
| `host` | No network isolation, shares host stack | Performance-critical, Linux only |
| `overlay` | Multi-host networking (Swarm/Compose) | Cross-machine containers |
| `none` | No networking | Isolated compute tasks |

Port mapping with `-p 8000:8000` maps host:container. Without it, the container port is unreachable from outside the bridge network.

Containers on the same user-defined bridge network resolve each other by container name. `ping api` from within another container on that network works. The default bridge doesn't support DNS; user-defined networks do.

## Volumes

Three ways to persist or share data:

```bash
# named volume (managed by Docker)
docker run -v pgdata:/var/lib/postgresql/data postgres

# bind mount (host directory)
docker run -v $(pwd)/config:/app/config myapp

# tmpfs (in-memory, gone on container stop)
docker run --tmpfs /tmp myapp
```

- **Named volumes**: managed by Docker, stored at `/var/lib/docker/volumes/`. Portable and easy to back up.
- **Bind mounts**: a host directory mounted into the container. Good for development with live reload; couples the container to the host filesystem layout in production.
- **tmpfs**: in-memory only. Use for secrets or scratch data you don't want on disk.

Prefer named volumes for production data. Prefer bind mounts for development workflows where you want live code reload.

## Docker Compose

Compose runs multi-container applications from a single `compose.yaml` file.

```yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

volumes:
  pgdata:
```

Key commands:

```bash
docker compose up -d           # start all services in background
docker compose logs -f api     # tail logs for one service
docker compose exec api sh     # shell into running service
docker compose down            # stop and remove containers
docker compose down -v         # also remove volumes
```

Compose creates a shared network named `<project>_default`. Services reach each other by service name: `api` connects to `postgres://db:5432/...` because `db` is both the service name and its DNS hostname on that network.

## Dockerfile best practices

### Multi-stage builds

Separate the build environment from the runtime image:

```dockerfile
# Stage 1: build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

The final image doesn't contain build tools, source code, or dev dependencies.

### .dockerignore

Like `.gitignore`, keeps the build context small:

```
node_modules/
.git/
.env
*.log
dist/
```

A large build context slows every build, even if the files aren't copied into the image.

### Non-root user

Containers run as root by default. Add a non-root user:

```dockerfile
RUN addgroup --system app && adduser --system --ingroup app app
USER app
```

### Layer hygiene

- Combine related `RUN` commands with `&&` to reduce layers.
- Clean up package manager caches in the same `RUN` command that installs (`pip install --no-cache-dir`, `apt-get clean && rm -rf /var/lib/apt/lists/*`). A cache in a later layer doesn't shrink the image.
- Put instructions that change frequently near the bottom (source code). Put instructions that change rarely near the top (base image, dependencies).

### Labels and metadata

```dockerfile
LABEL org.opencontainers.image.source="https://github.com/myorg/api"
LABEL org.opencontainers.image.version="1.2.3"
```

OCI standard labels make images discoverable in registries and audit tools.

## Docker and Kubernetes

Docker and Kubernetes are often treated as a required pair. They're not competitors, but they're also not glued together.

Docker's job: build an OCI-compliant image and push it to a registry.
Kubernetes's job: pull that image and run it across a cluster.

Kubernetes dropped Docker Engine as a runtime in Kubernetes 1.24. It uses `containerd` directly, which understands the same OCI image format that `docker build` produces. Nothing about building images with Docker changes when you deploy to Kubernetes.

A typical CI pipeline:

1. `docker build -t ghcr.io/myorg/api:sha-abc1234 .`
2. `docker push ghcr.io/myorg/api:sha-abc1234`
3. `kubectl set image deployment/api api=ghcr.io/myorg/api:sha-abc1234`

Docker Compose is for local development and small single-host deployments. When you need multiple machines, rolling updates, autoscaling, or service discovery at scale, Kubernetes takes over.

## Common footguns

- **`latest` tag in production**: the image changes under you on the next pull. Pin to a digest or immutable tag.
- **Secrets in environment variables**: visible in `docker inspect`, in process environment listings, and in logs. Use Docker secrets, BuildKit `--secret`, or a secrets manager for production.
- **Running as root**: most official images do it. Custom application images shouldn't.
- **No healthcheck**: orchestrators can't tell if the container is actually serving. Add a `HEALTHCHECK` instruction or a readiness probe.
- **Build context containing `node_modules` or `.git`**: without `.dockerignore`, every `docker build` sends gigabytes to the daemon for no reason.
- **Deleting files in a later `RUN` layer**: the bytes are still in the earlier layer. Delete in the same `RUN` command that created them.
- **Port conflicts**: `-p 8000:8000` on two containers on the same host fails silently. Use different host ports or a reverse proxy.

## References

- [Docker documentation](https://docs.docker.com/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose reference](https://docs.docker.com/compose/compose-file/)
- [BuildKit documentation](https://docs.docker.com/build/buildkit/)
- [OCI image spec](https://github.com/opencontainers/image-spec)
- [Docker Hub](https://hub.docker.com/)

## Related topics

- [Kubernetes](../kubernetes/), the orchestrator that runs containers at scale
- [Helm](../helm/), packaging Kubernetes workloads that use Docker images
- [GitOps](../gitops/), automated deployment pipelines that push Docker images to Kubernetes
- [MLOps](../mlops/), model serving containers and reproducible training environments
