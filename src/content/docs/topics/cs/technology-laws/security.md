---
title: "Security: Schneier's Law"
description: "Why you cannot evaluate the security of your own system, and what that means for cryptography, authentication, and everything you build."
parent: technology-laws
tags: [security, cryptography, software-engineering]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

One principle underlies most security failures: the person who designs a system cannot fully evaluate whether it is secure. This is not a competence problem. It is structural.

## Schneier's Law

Origin: Bruce Schneier, security technologist, formalized around 1998 in various writings, popularized by Cory Doctorow in 2004.

> Any person can invent a security system so clever that they themselves cannot think of how to break it.

The law is a statement about the limits of self-review in security contexts. Designing a secure system and evaluating whether a system is secure are two different skills. A sufficiently clever designer will produce a system they cannot attack themselves, not because it is secure, but because the designer's blind spots are the designer's blind spots.

### Why this is structurally different from other engineering disciplines

In most engineering, the person who builds something is a reasonable judge of whether it works. A developer who writes a sort function can verify it sorts correctly. An engineer who designs a bridge can run structural stress calculations. Security is different because the failure mode is adversarial. An attacker is not constrained by what the designer expects. The attacker will find the thing the designer didn't think of. The designer, by definition, can't think of it.

### In-depth examples

**The JWT "none" algorithm vulnerability (2015)**: JSON Web Tokens (JWT) support a header field `alg` that specifies the signing algorithm. A JWT signed with RS256 is cryptographically secure. But JWT libraries were required by the spec to support `alg: none`, meaning "no signature required, trust the payload." This was included for non-authenticated use cases.

Developers who built JWT authentication systems trusted that their code "verified" tokens. What their code did was: read the `alg` field and dispatch to the appropriate verification function. With `alg: none`, the "verification function" accepted any payload without a signature check. An attacker could take a legitimate token, decode it, change the `user_id` to an admin ID, re-encode it, set `alg: none`, and submit it. The server verified it successfully. Every developer who wrote this code designed a system they themselves couldn't break, because they assumed users would send tokens with legitimate algorithm fields.

**WEP encryption (1997-2003)**: WEP (Wired Equivalent Privacy) was designed by IEEE 802.11 working group members to encrypt Wi-Fi traffic. It used RC4, a legitimate stream cipher. The designers verified that each packet was encrypted with a key. They did not notice that the key was derived by concatenating a fixed shared secret with a 24-bit initialization vector (IV) that was transmitted in plaintext with each packet. With only 2^24 = 16 million possible IVs, on a busy network all possible IVs appeared within hours. An attacker could collect all IVs, apply the known plaintext attack against RC4, and recover the WEP key. The designers created a system they could not think of how to break. Cryptanalysts broke it in under 5 years.

**Dual_EC_DRBG (2006)**: Dual Elliptic Curve Deterministic Random Bit Generator was an NSA-proposed random number generator standardized by NIST in 2006. It was mathematically complex. The designers (and external reviewers initially) couldn't find weaknesses. It was adopted by RSA Security in their BSAFE toolkit and became the default in several crypto libraries. In 2007, Dan Shumow and Niels Ferguson noticed that the two elliptic curve constants in the algorithm had an unusual relationship. If you chose those constants to have a specific mathematical relationship (which was computationally feasible if you knew the discrete log), you could predict the generator's output from a short sample. In 2013, Snowden documents confirmed the NSA had backdoored it intentionally. Whether this is Schneier's Law or a deliberate backdoor is complicated, but the broader point stands: the security community, including many expert cryptographers, standardized a cryptographically compromised algorithm without detecting it.

**Homegrown hashing schemes**: A developer builds an internal API. They need to sign API keys. They invent a scheme: `HMAC-SHA256(secret, API_key + timestamp)` where the timestamp is the Unix second truncated to 5-minute windows. This prevents key reuse outside the window. The developer thinks: the secret is never transmitted, the timestamp prevents replay, SHA256 is strong. What they missed: truncating to 5-minute windows creates a timing oracle. An attacker can use a captured key for up to 5 minutes after obtaining it, including time the developer didn't intend to allow. A simpler scheme (HMAC with a nonce stored per-use) would have been more secure. The developer's cleverness in the timing window created a subtle, exploitable weakness they couldn't see.

### The practical lessons

1. **Use cryptography primitives you did not design.** AES, bcrypt, PBKDF2, argon2, NaCl/libsodium, TLS 1.3: these have been reviewed by cryptographers whose job is breaking things, not building them. Your homegrown scheme has not.

2. **Have your security-relevant code reviewed by people who are not you.** Not just code reviewed, but adversarially reviewed by someone trying to find flaws. The original author's blind spots are not a defect. They are structural.

3. **Do not roll your own authentication.** OAuth 2.0, OpenID Connect, and SAML are complex because authentication is complex. The complexity is the point: every edge case in those specs represents a vulnerability someone found in a simpler system.

4. **Assume your clever security design is broken.** The baseline position for any security-relevant design is: this is probably wrong in a way I can't see. The appropriate response is external review, not more internal cleverness.

### Schneier's Law applied to AI systems

LLM-based security controls (AI prompt injection defenses, AI-based abuse detection, AI-based CAPTCHA) are particularly prone to Schneier's Law. The designers of the control design it to resist the attacks they can imagine. Adversarial machine learning research has consistently shown that AI systems optimized against known attacks are breakable by novel attacks the designers hadn't considered. The law applies: the designer cannot fully anticipate the attacker.

### The positive version of the law

The only reliable defense against Schneier's Law is structured adversarial review: red teams, penetration testing, public security research, and bug bounties. Bring in people whose job is to find what you can't see.

---

## References

- Schneier, B. (1998). Various publications on cryptography and security engineering.
- Doctorow, C. (2004). "Schneier's Law." boingboing.net.
- Shumow, D. & Ferguson, N. (2007). "On the Possibility of a Back Door in the NIST SP800-90 Dual Ec Prng." CRYPTO 2007 rump session.
- Kelsey, J. et al. (2014). "The RC4 Weakness in WEP." *IEEE Transactions on Information Forensics and Security*.
- Bhargavan, K. et al. (2015). "On the Security of RC4 in TLS and WPA." *IEEE Symposium on Security and Privacy*.

## Related topics

- [API design laws](./api-design/): Postel's Law and the security vs. robustness tradeoff
- [Secrets, keys, and tokens](../../../ops/secrets-keys-tokens/): credential management and where security controls belong
- [API design](../../../system-design/api-design/): API authentication and authorization design
