---
title: Stateless auth, the idea, the tradeoffs, and what "stateless" actually means in practice
description: A walk through the stateless-auth idea, what JWTs buy you and don't, why sessions keep coming back, and the hybrid patterns that most modern systems actually run.
date: 2026-04-24
tags: [auth, jwt, sessions, security, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-stateless-auth/
---

## The promise of "stateless"

**Stateless authentication** means: every request contains everything the server needs to verify the caller's identity. No session lookup. No shared state between app servers. Just a token that the server cryptographically trusts.

The appeal:

- **Horizontal scale without a session store.** Any worker can serve any request.
- **No round-trip to Redis or a DB** to authenticate each call.
- **Cross-service propagation.** Service A signs a token; service B can verify it with the same public key, no shared infrastructure.

This is the central sales pitch of JWTs. It's real, and it's also narrower than the industry sometimes pretends.

## JWT, the most common instance

A JSON Web Token is a compact, signed (sometimes encrypted) token with three dot-separated base64url parts:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImV4cCI6MTcxNDA2NTYwMH0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

Three parts:

- **Header**, `{ "alg": "HS256", "typ": "JWT" }`. The algorithm.
- **Payload**, claims. `sub`, `exp`, `iat`, custom claims.
- **Signature**, HMAC or RSA/ECDSA signature of the header+payload.

The server verifies the signature, trusts the claims, and proceeds.

### Why JWTs are popular

- **Signed by issuer.** Anyone with the public key (RS256/ES256) or shared secret (HS256) can verify without calling the issuer.
- **Encoded claims.** User ID, roles, scopes all ride inside. No server-side lookup required to know who the caller is.
- **Standardized.** Every language has a JWT library.
- **Cross-domain.** An OIDC-issued JWT can be used by any service that knows the issuer's keys.

### What "stateless" doesn't mean

Stateless does not mean secure-by-default. It doesn't mean simpler overall. And it doesn't mean better, necessarily. What it means is: the *authentication* step is stateless. Other things, session management, logout, revocation, often are not.

## The revocation problem, the biggest footgun

A session-based system can log out by deleting the session. A JWT-based system can't: a JWT issued yesterday, with 24 hours of validity, is valid in every service that trusts the signer, whether or not the user "logged out."

Three responses:

### 1. Short-lived tokens + refresh tokens

The common pattern:

- **Access token**, JWT, 5–15 minutes, stateless.
- **Refresh token**, opaque, longer-lived (hours to days), stored server-side, used to mint new access tokens.

The access token doesn't need revocation because it expires quickly. The refresh token is server-managed and can be revoked (delete the row).

This is the OAuth 2 dance. Well-understood, works, but the "refresh" flow is state-ful, you're back to a session store for the thing that really matters.

### 2. Token blocklist

Keep a denylist of revoked JTIs (JWT IDs). Check on every request. You've re-introduced the round-trip you wanted to avoid.

Used in practice when the blocklist is small relative to issuance rate (most users never hit revoke).

### 3. Rotate signing keys

If a key is compromised, rotate. Old tokens become invalid. Blunt but effective, used for mass logouts (breach response).

### The practical reality

Every serious JWT system hits revocation. The pure-stateless dream is aspirational; hybrid is the norm.

## Size and payload bloat

JWTs ride in the `Authorization` header on every request. A claim-heavy JWT can exceed 1–2 KB:

```json
{
  "sub": "user-12345",
  "tenant": "acme",
  "roles": ["scheduler", "admin"],
  "scopes": ["read:patients", "write:visits", "read:clinicians", ...],
  "iat": 1714065600,
  "exp": 1714069200,
  "iss": "https://auth.acme.com",
  "aud": "https://api.acme.com"
}
```

On a high-RPS API, an extra 1 KB per request adds up. Keep JWTs lean: put stable, small claims in; put large or mutable state elsewhere.

## What you should actually put in a JWT

A minimal access token needs:

- `sub`, user ID (stable, opaque identifier)
- `iss`, issuer
- `aud`, audience (which service the token is for)
- `exp`, expiry
- `iat`, issued at
- Maybe `tenant` or `org_id` for multi-tenant routing

That's it. Roles, permissions, feature flags, these are mutable and better fetched on-demand by the receiving service using `sub`. Stuffing them into the JWT means a role change doesn't take effect until the token expires.

## Signing algorithms

Two main families:

### Symmetric (HS256, HS384, HS512)

Issuer and verifier share a secret. Simpler but requires trusting every verifier not to impersonate the issuer. Fine for a single service; don't use across organizational boundaries.

### Asymmetric (RS256, ES256, PS256)

Issuer holds a private key, signs. Anyone holds the public key, verifies. The standard for OIDC and multi-service ecosystems. ES256 is generally recommended over RS256 for new deployments, smaller tokens, comparable security.

### `alg: none`

A legacy option that disables signature verification. If your library accepts this by default, **you have a vulnerability**. Every mature library now rejects it; verify yours does.

## When to prefer sessions

Sessions, a random opaque ID stored in a cookie, paired with server-side state, are still the right answer for many cases:

- **First-party web apps.** The same server handles auth and API. No cross-service token propagation needed.
- **Mutable auth state.** Permissions, roles, features that change frequently. Server-side lookup keeps them fresh.
- **Easy logout.** Delete the row.
- **Short-lived user contexts.** Cart, checkout flows.
- **Compliance-sensitive products.** Revocation becomes an audit event, not a "wait 15 minutes for the token to expire."

A random 32-byte opaque token in a cookie, paired with a Redis-backed session store, is a boringly reliable pattern. It's not fashionable. It works.

## The hybrid pattern, what production really looks like

Most modern systems look like this:

```
                   ┌──────────────┐
                   │  Auth server │   issues tokens
                   │  (OIDC)      │   stores refresh tokens
                   └──────────────┘
                          │
                          │ short-lived access JWT
                          ▼
  ┌────────────┐   ┌─────────────┐   ┌─────────────┐
  │  Client    │──►│   Edge /    │──►│   Service   │
  │            │   │   Gateway   │   │  (stateless)│
  └────────────┘   └─────────────┘   └─────────────┘
                          │                 │
                          │                 │  for roles / flags
                          │                 ▼
                          │          ┌─────────────┐
                          │          │ Permissions │
                          │          │   service   │
                          │          └─────────────┘
                          │
                          │ for session mgmt
                          ▼
                   ┌──────────────┐
                   │ Session /    │
                   │ refresh store│
                   └──────────────┘
```

- Access token is JWT (stateless verification in every service).
- Refresh token is stored server-side (stateful, revocable).
- Mutable state (roles, flags) is fetched by services using the `sub` claim.

The industry converged on this because it balances the stateless win (fast verification) with the statefulness you need (revocation, mutable state).

## Service-to-service auth

Inter-service calls use the same JWT mechanism, with either user-propagated tokens (the client's JWT is re-used; often not what you want) or service JWTs (issued to each service, with its own identity).

**mTLS + JWT** is the modern service-to-service standard: mTLS authenticates the sender (who are you?), JWT carries the claim (what are you allowed to do?).

## A worked Python example

```python
# auth.py
from datetime import datetime, timedelta, timezone
import jwt  # PyJWT

PRIVATE_KEY = open("private.pem").read()
PUBLIC_KEY = open("public.pem").read()

ISSUER = "https://auth.acme.com"
AUDIENCE = "https://api.acme.com"

def issue_access_token(user_id: str, tenant: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "iss": ISSUER,
        "aud": AUDIENCE,
        "sub": user_id,
        "tenant": tenant,
        "iat": now,
        "exp": now + timedelta(minutes=15),
    }
    return jwt.encode(payload, PRIVATE_KEY, algorithm="ES256")

def verify_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        PUBLIC_KEY,
        algorithms=["ES256"],
        audience=AUDIENCE,
        issuer=ISSUER,
        options={"require": ["sub", "exp", "iat", "iss", "aud"]},
    )
```

Three rules worth internalizing:

1. **Pin the algorithm in `verify_access_token`.** Don't accept `alg=None`, and don't accept algorithms your issuer doesn't use (prevents algorithm confusion attacks).
2. **Verify `aud` and `iss`.** A leaked token from another service in your ecosystem shouldn't be accepted by *your* service.
3. **Require `exp`.** A JWT without an expiration is a permanent credential.

## Common mistakes

- **Put large mutable state in the JWT.** Tokens bloat; stale data serves for the life of the token.
- **Not verifying `aud`/`iss`.** Tokens intended for service A accepted by service B is a privilege-escalation vulnerability.
- **Using HS256 when RS256/ES256 is available.** Symmetric keys don't scale across service boundaries.
- **Storing JWTs in `localStorage`.** XSS-readable. See the [sessions/JWTs/cookies post](../2026-04-24-sessions-jwts-cookies/).
- **Never rotating signing keys.** A leaked key is valid forever.
- **Missing `exp`.** Rare in practice, catastrophic when it happens.
- **Trusting claims without verification.** Base64-decoding a JWT without verifying the signature reads whatever the attacker wants it to read.
- **Ignoring clock skew.** `exp` enforcement without leeway rejects valid tokens across servers with mildly-different clocks. PyJWT defaults to 0; set `leeway=30` seconds.
- **Expecting stateless to mean "no session store."** You still need one for refresh. Plan for it.

## When to not use JWTs at all

- **Single-origin first-party web app.** Use cookies + server sessions. Simpler, more secure, easier to reason about.
- **Low-volume systems with active moderation.** Revocation matters more than scale.
- **Deep regulatory context.** Some auditors prefer server-managed sessions because revocation is immediate and logged.

JWTs are great when their model fits. They're not a default.

## References

- [RFC 7519, JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 8725, JWT Best Current Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OAuth 2.0, RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [Auth0, *JWT Handbook*](https://auth0.com/resources/ebooks/jwt-handbook), thorough practical guide
- [Tim McLean, *Critical vulnerabilities in JWT libraries*](https://www.chosenplaintext.ca/2015/03/31/jwt-algorithm-confusion.html), the historical "why you verify algorithms" post
- [Randall Degges, *Stop Using JWTs as Session Tokens*](https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens), the skeptical case

## Related topics and posts

- [Sessions, JWTs, and cookies, security and tradeoffs](../2026-04-24-sessions-jwts-cookies/)
- [REST API design](../2026-04-24-rest-api-design/)
- [Throttling and rate limiting](../2026-04-24-throttling-and-rate-limiting/)
- [Django Part 5, Authentication](../../topics/web/django/part-05-authentication/)
