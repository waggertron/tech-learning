---
title: "Tokens, Keys, Secrets, and Environment Variables"
description: "What each credential type actually is, how they differ, where they live, and the mistakes that expose them: API keys vs tokens vs secrets vs env vars."
parent: ops
tags: [ops, security, credentials, secrets-management, authentication]
status: draft
created: 2026-05-07
updated: 2026-05-07
---

These four terms are often used interchangeably, but they describe different things with different lifetimes, scopes, and storage requirements. Confusing them leads to real problems: secrets committed to git, tokens stored with too-broad a scope, env vars used where a secret manager is needed.

## The definitions

### Environment variable

A named string in a process's environment, inherited by child processes. Not inherently secret -- `PATH`, `HOME`, and `PORT` are all environment variables. The confusion arises because env vars are a common *delivery mechanism* for secrets: you inject a secret into a process at startup via an env var, so the secret never appears in source code.

```bash
export DATABASE_URL="postgres://user:pass@host:5432/db"
node server.js   # server reads process.env.DATABASE_URL
```

Env vars have no built-in access control, encryption, or audit log. They are visible to any code running in the process, often appear in crash dumps and debug output, and are inherited by child processes. They are a convenience, not a security primitive.

### Secret

Any value that must not be exposed: passwords, private keys, connection strings, cryptographic seeds. "Secret" is the category. The others are types of secret.

Secrets need:
- **Encryption at rest** (not just Base64)
- **Access control** (only specific services can read them)
- **Audit logging** (who read what, when)
- **Rotation** (ability to change without redeployment)

A hardcoded database password in source code is a secret that is being handled wrongly. An env var injected at runtime from a secrets manager is the same secret handled correctly.

### API key

A long random string that identifies and authenticates a caller to an API. API keys are typically:

- **Stateless**: the API server validates the key on every request without session state
- **Long-lived**: they do not expire automatically (though they should be rotatable)
- **Coarse-grained**: one key usually grants access to an entire API or a predefined permission set
- **Not user-specific**: they identify an application or integration, not a human

```
Authorization: Bearer sk_live_<your_api_key_here>
```

API keys are secrets. They should be stored in a secrets manager, injected via env var at runtime, never committed to source code, and rotated on any suspected exposure.

### Token

A credential that represents a grant of access, usually time-limited. Tokens come in two shapes:

**Opaque tokens** are random strings. The server validates them by looking them up in a database or cache. Session cookies and OAuth access tokens are often opaque.

**Structured tokens** encode claims directly. A JWT (JSON Web Token) contains a header, payload (claims like `sub`, `exp`, `scope`), and a signature. The server validates the signature without a database lookup, then reads the claims.

```
<jwt_header>.<jwt_payload>.<jwt_signature>
```

Tokens are typically:
- **Short-lived**: they expire (minutes to hours for access tokens)
- **Scoped**: they encode what the bearer is allowed to do
- **User or session-specific**: one token per user session, not per application

A refresh token is a longer-lived credential used to get new access tokens. It is a secret and must be stored securely.

### Signing key / secret key

A cryptographic key used to sign or verify data (HMAC, RSA, ECDSA). It is never sent over the wire -- it lives server-side and is used to produce or verify signatures.

JWT signing keys are a common example: the server signs tokens with a private key. Clients (or other servers) verify with the corresponding public key. If the signing key leaks, an attacker can forge any token the key would sign.

Signing keys are secrets with an even stricter rotation requirement than API keys.

### Personal access token (PAT)

A token that represents a human identity on a platform (GitHub PAT, GitLab PAT, Netlify token). PATs are scoped to specific permissions and are revocable. They are used in place of passwords for API access, CI/CD pipelines, and automation.

PATs are secrets. They should be stored in a secrets manager, not hardcoded in scripts or CI config files.

## Comparison table

| Type | Identifies | Expires | Scope | Where to store |
| --- | --- | --- | --- | --- |
| API key | Application/integration | Rarely (manually rotated) | Usually coarse | Secrets manager |
| Access token | User session | Yes (minutes to hours) | Fine-grained (scopes) | Memory only (never persisted) |
| Refresh token | User session | Yes (days to weeks) | Scoped | Secrets manager / secure cookie |
| JWT | Bearer's claims | Yes (embedded in payload) | Claims-encoded | Memory only (validate, don't store) |
| PAT | Human identity | Configurable | Platform-defined | Secrets manager |
| Signing key | Server identity | No (manually rotated) | N/A (server-only) | Secrets manager |
| Env var | N/A (delivery mechanism) | N/A | N/A | Source is the secret, not the var |

## Where secrets actually live

```
Dev machine        CI/CD              Production
-----------        -----              ----------
.env file          GitHub Secrets     AWS Secrets Manager
(git-ignored)      (encrypted)        GCP Secret Manager
                                      HashiCorp Vault
                                      Azure Key Vault
                                      Kubernetes Secrets
                                      (base64, not encrypted by default)
        All injected as env vars at runtime
```

The flow is always: **secret lives in a manager → injected as env var at startup → read once into memory → used**. The env var is a transport layer, not storage.

## Common mistakes

**Committing secrets to git.** The most common exposure. `.env` files, hardcoded connection strings, API keys in config files. Even a "private" repo is a risk -- access spreads, and git history is permanent. Use `.gitignore` for `.env` and scan with tools like `trufflehog` or `gitleaks`.

**Logging secrets.** Logging `request.headers` or `process.env` in a handler logs every secret the process has. Redact or allowlist what gets logged.

**Broad token scopes.** An API key or PAT with admin scope is a single point of catastrophic failure. Use the minimum scope needed.

**Long-lived tokens where short-lived ones would work.** If a token can expire in 15 minutes, it should. An expired token that leaks is useless. An API key with no expiry that leaks is a permanent credential.

**Kubernetes Secrets are not secret by default.** They are base64-encoded, not encrypted. Anyone with `kubectl get secret` access can decode them. Enable encryption at rest and use external secrets operators (External Secrets Operator, Sealed Secrets) for production clusters.

**Storing tokens in localStorage.** Accessible to any JavaScript on the page (XSS risk). Prefer `httpOnly` cookies for session tokens.

**Sharing secrets via Slack, email, or clipboard.** Use a secret manager's sharing mechanism or a one-time-use tool like `onetimesecret.com` for emergencies.

## The injection pattern

The correct runtime pattern for every environment:

```bash
# Dev: .env file (git-ignored), loaded by dotenv or equivalent
DATABASE_URL=postgres://localhost/mydb

# CI: platform secrets (GitHub Actions, GitLab CI)
# Set in repository settings UI, referenced as:
${{ secrets.DATABASE_URL }}

# Production: secrets manager + env injection
# AWS example (ECS task definition):
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123:secret:prod/db-url"
    }
  ]
}
```

The application code reads `process.env.DATABASE_URL` (or `os.environ["DATABASE_URL"]`) in all environments. The source of truth changes per environment. The application does not.

## References

- [OWASP: Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [JWT.io: JSON Web Tokens introduction](https://jwt.io/introduction)
- [12-factor app: Config](https://12factor.net/config), the original case for env var injection
- [GitHub: Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [HashiCorp Vault: Why Vault?](https://developer.hashicorp.com/vault/docs/what-is-vault)

## Related topics

- [Kubernetes](../kubernetes/), where Secrets objects live and how to use External Secrets Operator
- [GitOps](../gitops/), how secrets flow through a GitOps pipeline without being committed to git
- [Django Part 5: Authentication](../../web/django/part-05-authentication/), tokens and sessions in practice
- [Express Part 5: Authentication](../../web/express/part-05-authentication/), JWT and session patterns in Node
