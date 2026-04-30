---
title: Sessions, JWTs, and cookies, security and tradeoffs
description: Where you put the auth token decides your threat model. A walk through session cookies, JWTs in headers, JWTs in cookies, the XSS/CSRF tradeoff, SameSite, HttpOnly, Secure, and why the "right answer" depends on the shape of your product.
date: 2026-04-24
tags: [auth, cookies, jwt, xss, csrf, security]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-sessions-jwts-cookies/
---

## The real question behind "should I use a JWT?"

It's not about JWT vs session. It's about **where the authentication credential lives on the client** and **what attacks reach it**.

Three common arrangements, each with a distinct threat model:

1. **Server-side session + opaque session cookie.**
2. **JWT in `Authorization: Bearer` header (localStorage / memory).**
3. **JWT in a cookie.**

All three work. Each is wrong for certain products. Pick deliberately.

## Threats to understand

Two high-impact web-app attacks dominate this choice:

### XSS, Cross-Site Scripting

Attacker injects JavaScript into your site (via an input you failed to sanitize, a compromised npm package, a malicious ad iframe, etc.). That script runs in the victim's session and can read anything the page's JavaScript can read.

If your auth token is in `localStorage`, the attacker's script grabs it and walks away. Game over.

### CSRF, Cross-Site Request Forgery

Victim visits `evil.com`. That site makes a request to `yourapp.com` (via an image, form, or fetch). The browser attaches `yourapp.com`'s cookies automatically. If your site doesn't verify the request is intentional, the attacker forced an authenticated action (change password, transfer money).

If your auth token is in a cookie, CSRF matters.

## The arrangements, with their threat models

### 1. Server session + session cookie

Cookie holds an opaque random token. Server looks up session state in Redis / DB on every request.

| Property | Value |
| --- | --- |
| Token location | Cookie (`HttpOnly; Secure; SameSite=Lax`) |
| XSS risk on token | **Low**, `HttpOnly` blocks JS access |
| CSRF risk | **Yes**, cookies are attached to cross-site requests. Mitigate with SameSite + CSRF tokens. |
| Revocation | Instant, delete the session row |
| Scale | Requires session store |
| Good for | First-party web apps, admin consoles |

**Why it's still the default for web apps:** `HttpOnly` cookies are not readable from JavaScript. Even a successful XSS can't exfiltrate the token. SameSite=Lax blocks most cross-site request forgery automatically; a CSRF token defeats the rest.

### 2. JWT in Authorization: Bearer header

Client stores JWT in `localStorage` or in-memory. Sends it in `Authorization: Bearer <token>`.

| Property | Value |
| --- | --- |
| Token location | `localStorage` or JS memory |
| XSS risk on token | **High**, any XSS exfiltrates it |
| CSRF risk | **No**, no automatic attach; attacker must actively send the header |
| Revocation | Hard, see [stateless auth post](../2026-04-24-stateless-auth/) |
| Scale | No session store needed for verification |
| Good for | Mobile apps, CLI tools, SPAs with strong CSP |

**The XSS worry is real.** In a SPA, a single vulnerable dependency can leak every user's token. Some teams store the JWT in memory only (not localStorage), which survives refresh less gracefully but is less grabbable.

### 3. JWT in a cookie

Put the JWT itself in a cookie. Get browser automation (auto-send on navigation), `HttpOnly` protection, *and* stateless verification.

| Property | Value |
| --- | --- |
| Token location | Cookie (`HttpOnly; Secure; SameSite=Strict/Lax`) |
| XSS risk on token | **Low**, `HttpOnly` |
| CSRF risk | **Yes**, cookies are attached cross-site. Same mitigations apply. |
| Revocation | Same JWT problem as Bearer, expiry-based |
| Scale | No session store |
| Good for | First-party SPAs that want to skip a session store |

This hybrid is popular. It gives you the cookie security model without needing a Redis session store, you pay for revocation in expiry-based attack windows.

## Cookie flags, get these right

For any cookie carrying auth:

- **`HttpOnly`**, not readable from JavaScript. Block XSS from reading it.
- **`Secure`**, only sent over HTTPS. Always in prod.
- **`SameSite=Lax`** (default for most browsers now), cookie sent on top-level cross-site navigations (link clicks), but not on cross-site POSTs or iframe subresources. Blocks the nastiest CSRF.
- **`SameSite=Strict`**, cookie never sent cross-site. Maximally safe, but breaks top-level navigations (you're logged out when you click a link from email).
- **`SameSite=None`**, cookie sent on all cross-site requests. Requires `Secure`. Only for third-party contexts (embedded widgets, analytics pixels).
- **`Domain`**, scope. Tight scoping reduces the attack surface.
- **`Path`**, narrow it to the auth path if the cookie is only meant for that.
- **`Max-Age` / `Expires`**, don't issue "forever" cookies unless you really mean it.

Python example with Django:

```python
SESSION_COOKIE_NAME = "sessionid"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_AGE = 60 * 60 * 8            # 8 hours
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False                # CSRF token must be JS-readable
CSRF_COOKIE_SAMESITE = "Lax"
```

## CSRF, what actually works

Token-based CSRF protection:

1. Server sets a `csrftoken` cookie (JS-readable, *not* HttpOnly).
2. Client reads the cookie, includes its value in `X-CSRFToken` header for every non-idempotent request.
3. Server compares cookie and header; rejects if mismatched.

An attacker on `evil.com` can cause the browser to send the cookie, but can't read it (same-origin policy), so can't put it in a header. Defeats CSRF.

This is the "Double Submit Cookie" pattern. Combined with SameSite=Lax, it's overkill in the safe direction, which is what you want.

## XSS, don't ship XSS

No matter where the token is, an XSS is bad. Mitigation:

- **Content Security Policy (CSP).** Restrict which scripts can run. Blocks injected inline JS by default.
- **Auto-escaping templates.** Django, Rails, React, Vue, etc. all auto-escape by default. Never `dangerouslySetInnerHTML` or `|safe` without extreme care.
- **Sanitize user HTML** (if you allow any) with a battle-tested library (DOMPurify).
- **Trusted Types** in browsers that support it.
- **SRI on third-party scripts.** `<script src="..." integrity="sha256-...">`.

CSP with `script-src 'self'` (no `unsafe-inline`, no `unsafe-eval`) drops 90% of XSS attacks without any code changes. It's worth the migration effort.

## What "don't store in localStorage" actually means

Some teams interpret "never store JWTs in localStorage" literally and end up with worse designs. The nuance:

- **Storing the token in localStorage** is dangerous if your app is vulnerable to XSS.
- **The right answer** is either: store it in `HttpOnly` cookie (no JS access), or keep it in memory (grabbable only during a live XSS session, not persisted).
- **In-memory** means the token is lost on refresh, OK if you have a refresh token flow that can re-acquire silently (via a refresh cookie or SSO).

Most production SPAs settle on: refresh token in `HttpOnly` cookie, access token in memory. Mobile apps use secure OS-level keychains.

## The OAuth 2 authorization code flow, briefly

The modern recommended flow for SPAs: **authorization code + PKCE**:

1. User clicks "Log in" on SPA.
2. SPA redirects to the authorization server with a PKCE code challenge.
3. User authenticates, authorization server redirects back with an authorization code.
4. SPA exchanges the code + PKCE verifier for an access token + refresh token.
5. SPA stores the access token in memory; refresh token in an HttpOnly cookie.

Replaces the older *implicit flow* (token in URL fragment), which is now discouraged.

## Rotate refresh tokens

A refresh token steady-state isn't great: if stolen, it regenerates access tokens forever. Rotation:

- Every time a refresh token is used, issue a new one, invalidate the old.
- Track the entire family. If an old refresh token is used after rotation, the whole family is compromised, kill the session.

Auth0, Okta, Cognito, and most modern providers implement this automatically. If you roll your own, include it.

## CSRF in SameSite=Lax world

Modern browsers default to `SameSite=Lax`, which blocks most CSRF automatically. Three things still matter:

- **SameSite=Lax lets top-level navigations send cookies.** A cross-site `<form method="POST">` still submits with cookies if the user clicks through. CSRF tokens defend against this.
- **Not every browser is current.** Support older browsers with explicit CSRF tokens until you can drop them.
- **CORS and credentialed fetch.** `fetch(..., { credentials: 'include' })` only succeeds if the server's CORS headers allow it. Configure CORS tightly.

## What most teams ship

For a typical B2B SaaS in 2026:

- **First-party web app:** Session cookie + server-side session. `HttpOnly`, `SameSite=Lax`, CSRF token. Revocation easy, scale fine up to a few million users on a single Redis cluster.
- **Mobile + third-party clients:** OAuth 2 with PKCE. Access token in memory (mobile: keychain). Refresh token rotated.
- **Service-to-service:** mTLS + service JWTs. No cookies involved.

This three-lane setup covers most security and operational needs without being exotic.

## Common mistakes

- **Putting JWTs in `localStorage` with no CSP.** The first XSS empties every user.
- **Using `SameSite=None` without a reason.** Turns on cross-site cookie attaching, widens the CSRF surface.
- **Missing `Secure` in production.** Cookie sniffed over plain HTTP.
- **Cookie scope too wide.** `Domain=.acme.com` sent to every subdomain; a subdomain compromise leaks the cookie.
- **Forgetting to set CSRF tokens on new endpoints.** Every non-idempotent endpoint needs it.
- **Refreshing tokens indefinitely.** Without a max-session length, a stolen refresh token lives forever.
- **Not rotating refresh tokens.** A leaked refresh token generates access tokens until it's discovered, which is usually after damage.
- **Leaking tokens in logs.** `Authorization` headers sometimes end up in access logs, proxy logs, error reports. Scrub them.
- **Trusting the `Host` header for cookie domain.** A user-controlled header sets a cookie on a wrong domain.

## A practical checklist

For any new authenticated product:

- [ ] Decide where the credential lives (cookie / header / memory), write it down.
- [ ] Set `HttpOnly; Secure; SameSite=Lax` on auth cookies.
- [ ] CSRF token on all non-idempotent endpoints (if using cookies).
- [ ] Content Security Policy, at minimum `script-src 'self'`.
- [ ] Refresh token rotation with family tracking.
- [ ] Short access-token lifetime (5–15 minutes).
- [ ] Logout actually invalidates, delete session / add to denylist.
- [ ] Max session length, force re-auth after N hours.
- [ ] Rate limit login (see [throttling post](../2026-04-24-throttling-and-rate-limiting/)).
- [ ] Audit log every auth decision (login, token refresh, logout, revocation).

## References

- [OWASP, Cross-Site Scripting (XSS) prevention cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP, CSRF prevention cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN, `Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) and [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [OAuth 2 Security Best Current Practice (RFC 8725 + 9068)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [PKCE for OAuth public clients (RFC 7636)](https://datatracker.ietf.org/doc/html/rfc7636)
- [MDN, Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Thomas Ptacek, *You probably shouldn't use JWTs*](https://fly.io/blog/api-tokens-a-tedious-survey/), a good skeptical read
- [Randall Degges, *Stop Using JWTs as Session Tokens*](https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens)

## Related topics and posts

- [Stateless auth](../2026-04-24-stateless-auth/), the broader JWT discussion
- [REST API design](../2026-04-24-rest-api-design/)
- [Throttling and rate limiting](../2026-04-24-throttling-and-rate-limiting/)
- [Modern browser security concerns](../2026-04-24-modern-browser-security/)
- [Django Part 5, Authentication](../../topics/web/django/part-05-authentication/)
