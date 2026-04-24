---
title: Modern web browser security, the threats, the headers, and what Chrome has been doing about them
description: Same-origin policy, CORS, CSP, supply-chain attacks, clickjacking, cookie theft, CVE soup. What the browser protects you from by default, what it doesn't, and the headers / features you should ship on every site.
date: 2026-04-24
tags: [browser, security, web, csp, cors]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-modern-browser-security/
---

## What browsers protect against by default

Modern browsers enforce **a lot** of security without developer involvement:

- **Same-Origin Policy (SOP)**, page from `a.com` can't read the DOM or response bodies of `b.com`. This is the foundation.
- **Mixed-content blocking**, HTTPS pages can't load `http://` resources.
- **Sandboxed iframes**, a cross-origin iframe can't touch the parent, and vice versa, beyond explicit `postMessage`.
- **Site isolation**, since 2018, Chrome puts each site in its own process to contain Spectre-class attacks.
- **Default `SameSite=Lax`** on cookies, blocks the most common CSRF scenarios automatically.
- **Automatic HTTPS upgrade**, HSTS preloading, plain `http://` navigation is actively warned against.

If you do nothing else, your site is substantially harder to attack than it was in 2010. Still, "default" isn't "done." There's a dozen headers and features you should layer on.

## The threat catalog

Modern browser threats, roughly in order of prevalence and impact:

### 1. Cross-Site Scripting (XSS)

Attacker-controlled HTML or JS runs in your origin. Has full access to cookies (if not `HttpOnly`), localStorage, the DOM, and any same-origin API your app can call.

**Where it enters:** user inputs reflected without escaping, `innerHTML` / `dangerouslySetInnerHTML` with untrusted data, untrusted URLs in `href`, event handlers derived from input.

**Blast radius:** complete account takeover if any auth material is JS-readable.

### 2. Cross-Site Request Forgery (CSRF)

Attacker's site makes the victim's browser send an authenticated request to yours. The browser attaches cookies automatically.

**Mitigation:** `SameSite=Lax` (default), CSRF tokens, check `Origin` / `Referer` for sensitive endpoints.

### 3. Clickjacking

Attacker embeds your site in an iframe and tricks the user into clicking something invisible.

**Mitigation:** `Content-Security-Policy: frame-ancestors 'none'` or `X-Frame-Options: DENY`.

### 4. Supply-chain compromise

Your site loads a compromised third-party script: analytics, ad networks, a bundled npm dependency.

**Blast radius:** same as XSS, the attacker's code runs in your origin.

**Mitigation:** CSP, Subresource Integrity (SRI), careful dependency review, minimal third-party scripts.

### 5. Session and token theft

Cookie or JWT exfiltrated via XSS, man-in-the-middle on insecure pages, or malicious extensions.

**Mitigation:** `HttpOnly; Secure; SameSite`, HTTPS everywhere, short token lifetimes.

### 6. Cookie tossing / subdomain attacks

A compromised subdomain (`blog.acme.com`) sets cookies readable by `*.acme.com`, poisoning the main app.

**Mitigation:** scope cookies tightly (`Domain=acme.com` only when necessary), use `__Host-` cookie prefix.

### 7. Prototype pollution and other client-side injection

A newer class: manipulating JavaScript prototypes via user input to inject properties that propagate everywhere. Often chains into XSS.

### 8. Spectre and timing side-channels

Speculative-execution attacks that can read cross-origin memory in shared processes. Largely mitigated by site isolation and `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` / `Cross-Origin-Resource-Policy`.

### 9. Browser extension abuse

Malicious extensions with host permissions can read every page. Outside your control as a site, but relevant when your customers ask "is my account safe?"

### 10. WebAssembly and sandbox escapes

Rare, high-impact. Browser bugs, patched quickly, but running malicious Wasm in a compromised ad iframe is a real path.

## The security headers you should ship

A checklist for every production HTML response:

### Content-Security-Policy

The most powerful single header. Restricts which scripts, styles, images, fonts, iframes, and connections the browser allows.

Minimum viable policy:

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.acme.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

- `default-src 'self'`, everything same-origin unless overridden.
- `script-src 'self' 'nonce-...'`, only your scripts + inline scripts with matching nonce. **No `unsafe-inline`**, no `unsafe-eval` for JS.
- `frame-ancestors 'none'`, no one can iframe you. Replaces `X-Frame-Options`.
- `base-uri 'self'`, stops `<base>` tag injection from redirecting relative URLs.

Start with `Content-Security-Policy-Report-Only` + a reporting endpoint. Fix violations. Then promote to enforcing.

### Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Forces browsers to use HTTPS for the next year. The `preload` directive submits you to browsers' preload list, a permanent decision. Don't preload until you're *sure* every subdomain supports HTTPS.

### X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

Prevents MIME-type sniffing. A `text/plain` response that looks like HTML won't be rendered as HTML.

### Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

Limits what's sent in the `Referer` header. Stops leaking URLs with tokens or sensitive paths to third parties.

### Permissions-Policy

```
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
```

Lock down browser APIs your app doesn't use. If you don't need geolocation, block it, a compromised third-party script can't then prompt users for their location.

### Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy, Cross-Origin-Resource-Policy

Together these unlock cross-origin isolation and high-precision timers safely:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-site
```

Set them if you need `SharedArrayBuffer` or precision timers. Otherwise `COOP: same-origin` alone is a good baseline, prevents a popup from reading your window.

### X-Frame-Options (legacy)

```
X-Frame-Options: DENY
```

Superseded by CSP's `frame-ancestors`, but keep it for older browsers.

## Cookie hardening (expanded)

Cookie flags every auth cookie must have:

- `HttpOnly`, not readable from JS.
- `Secure`, HTTPS only.
- `SameSite=Lax` or `Strict`, CSRF mitigation.
- `Path=/` or narrower.
- `__Host-` prefix for extra safety: `Set-Cookie: __Host-session=...; Secure; Path=/; SameSite=Lax`. Browsers reject this cookie if `Secure` is missing, `Path` isn't `/`, or `Domain` is set, eliminating cookie tossing.

## Subresource Integrity (SRI)

Every third-party `<script>` and `<link rel="stylesheet">` loaded from a CDN should have an integrity hash:

```html
<script src="https://cdn.example.com/jquery.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

The browser refuses to execute if the fetched file doesn't match. Prevents a compromised CDN from silently swapping in malicious code.

## Trusted Types

A newer Chrome feature (available in most modern browsers, spec stabilizing). Trusted Types forces all dangerous DOM sinks (`innerHTML`, `document.write`, `src`) to accept only objects produced by policies your code defines:

```js
if (window.trustedTypes && trustedTypes.createPolicy) {
  const policy = trustedTypes.createPolicy('escape', {
    createHTML: (input) => DOMPurify.sanitize(input),
  });
  element.innerHTML = policy.createHTML(userInput);
  // raw strings are rejected
}
```

Enable via CSP:

```
Content-Security-Policy: require-trusted-types-for 'script';
```

Effectively eliminates DOM-based XSS. Adoption is still early but growing; worth enabling in new apps.

## CORS, widely misunderstood

CORS relaxes the Same-Origin Policy for specific cases. Critical correctness points:

- **CORS is not access control.** It protects *the user's browser* from reading a response. It doesn't protect your API. Always enforce auth on the server.
- **`Access-Control-Allow-Origin: *` disallows credentials.** If you need cookies / auth, echo the specific origin and set `Access-Control-Allow-Credentials: true`.
- **Never reflect arbitrary origins.** `Access-Control-Allow-Origin: <request.Origin>` without validation makes your API accessible to *every* website with user credentials. Validate against a whitelist.
- **Preflight requests**, browsers issue an OPTIONS request before non-simple requests. Handle it server-side; return the right `Access-Control-Allow-*` headers.

## Dependency supply chain

npm, PyPI, and similar ecosystems have all seen malicious package takeovers, typosquatting, and dependency-confusion attacks. Defenses:

- **Lockfiles.** `package-lock.json`, `uv.lock`, `Cargo.lock`. Pin exact versions.
- **Automated scanning.** Dependabot / Renovate for updates; Snyk / Socket / Semgrep for CVE and malicious-package detection.
- **Minimum permissions in CI.** Don't give `npm install` access to secrets.
- **Lower the dependency count.** Every transitive dep is a risk. Tree-shake. Audit once a quarter.
- **Subresource integrity** for anything loaded at runtime.

## Browser-feature-specific concerns

- **`window.open` and `target="_blank"`.** Without `rel="noopener noreferrer"`, the opened window can manipulate your page via `window.opener`. Always set the rel.
- **Password managers.** Disabling autocomplete (`autocomplete="off"`) on login forms *harms* security, users pick weaker passwords. Don't do it.
- **`localStorage` for sensitive data.** Readable by any JS running in your origin. XSS = exfiltration.
- **Service Workers.** Powerful but can be hijacked if you don't scope them correctly. Always scoped to the path they're registered at.
- **PostMessage to iframes.** Always validate `event.origin`. Never blindly trust messages.

## Observability

Set a CSP reporting endpoint and alert on patterns:

```
Content-Security-Policy-Report-Only: ...; report-to csp-endpoint
Reporting-Endpoints: csp-endpoint="https://acme.com/csp-report"
```

Spikes in CSP violations often reveal active attacks or a new vendor trying to load a script you didn't authorize.

## What's been changing recently (2024–2026)

The browser platform has been getting safer without much fanfare:

- **Third-party cookies ending.** Chrome's transition complete in 2024; Firefox and Safari already ahead. Cross-site tracking via cookies is over.
- **Privacy Sandbox.** Chrome-led replacement for third-party cookies, Topics API, FLEDGE / Protected Audience, Attribution Reporting. Controversial, but reshapes ads without direct tracking.
- **Post-quantum TLS.** Chrome and Firefox ship Kyber / ML-KEM hybrid key exchanges. Long-term plan for the cryptography transition.
- **Storage Partitioning.** Cross-site iframes now get their own storage keyed to the top-level site, not the iframe's origin. Breaks some legacy trackers.
- **Declarative Net Request**, ad-blocker / extension API in MV3, tighter sandboxing of extension behavior.
- **Credential management and passkeys.** WebAuthn / passkey UX now feasible as the primary auth method on many properties.
- **Fenced Frames.** A stronger iframe with additional isolation, one of the Privacy Sandbox primitives.

Keep reading Chrome Platform Status and Mozilla's Firefox release notes; the pace is fast.

## A minimum-viable browser-security checklist

Before shipping a public site:

- [ ] HTTPS everywhere. HSTS set.
- [ ] CSP with `script-src 'self'` + nonces. No `unsafe-inline` or `unsafe-eval` for scripts.
- [ ] `frame-ancestors 'none'` (or `'self'` if you legitimately iframe yourself).
- [ ] `X-Content-Type-Options: nosniff`.
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] Cookies: `HttpOnly; Secure; SameSite=Lax`, preferably `__Host-` prefixed.
- [ ] CORS origin-whitelist; no wildcards with credentials.
- [ ] SRI on every third-party script.
- [ ] No `localStorage` for auth tokens.
- [ ] Automated dependency scanning in CI.
- [ ] CSP report endpoint monitored.
- [ ] `noopener noreferrer` on all external links.

## Common mistakes

- **Shipping CSP in report-only forever.** Staying in report-only never actually blocks attacks.
- **`unsafe-inline` in `script-src`.** Gives up most of CSP's value. Migrate to nonces.
- **Wide CORS allowing credentials.** A pervasive vulnerability. Whitelist tightly.
- **Cookies with `Domain=.acme.com` scope.** Readable from every subdomain, one subdomain XSS leaks everywhere.
- **Disabling SOP with `crossorigin` attributes you don't understand.** Read the docs before setting them.
- **Assuming CSP stops supply-chain attacks on your own code.** If your own script is compromised (`script-src 'self'` allows it), CSP won't save you.
- **Forgetting about fonts and images.** CSP `font-src` / `img-src` default to `default-src`. Missing either can make legitimate assets fail.
- **Not testing the headers in all environments.** Staging is sometimes more relaxed; the prod deploy finds what staging never caught.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/), the canonical web-app threat taxonomy
- [MDN, Web Security](https://developer.mozilla.org/en-US/docs/Web/Security), deep explainers on every primitive
- [MDN, Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [web.dev, Security](https://web.dev/secure/), Google's hands-on guides
- [Chrome Platform Status](https://chromestatus.com/), upcoming browser changes
- [Securitum CSP Evaluator](https://csp-evaluator.withgoogle.com/), lint your CSP
- [Mozilla Observatory](https://observatory.mozilla.org/), scan your site's security headers
- [Troy Hunt, Secure headers](https://www.troyhunt.com/shhh-dont-let-your-response-headers/), older but still relevant
- [Scott Helme, securityheaders.com](https://securityheaders.com/), rate your site

## Related topics and posts

- [Sessions, JWTs, and cookies, security and tradeoffs](./2026-04-24-sessions-jwts-cookies/)
- [Stateless auth](./2026-04-24-stateless-auth/)
- [REST API design](./2026-04-24-rest-api-design/)
- [Throttling and rate limiting](./2026-04-24-throttling-and-rate-limiting/)
- [AI Coding Tool Blindspots, Slopsquatting](../topics/ai/coding-tool-blindspots/slopsquatting/), an emerging supply-chain vector
