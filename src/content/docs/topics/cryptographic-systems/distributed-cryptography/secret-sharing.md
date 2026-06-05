---
title: Secret Sharing
description: "Shamir's Secret Sharing, verifiable variants, and the threshold reconstruction math: split a secret into n shares where any t reconstruct it exactly and t-1 reveal nothing."
parent: distributed-cryptography
tags: [cryptography, secret-sharing, shamir, vss]
status: draft
created: 2026-06-04
updated: 2026-06-04
---

A secret backed up on five servers is only as safe as the least secure of those servers. Shamir's Secret Sharing (SSS) fixes this: it encodes a secret as a polynomial so that any t evaluation points reconstruct the secret exactly, while t-1 points reveal nothing at all. "Nothing at all" is not intuitive but it is mathematically precise: t-1 shares are statistically independent of the secret. An adversary with t-1 shares learns nothing they did not already know.

## The core idea

Lagrange interpolation says: given any t points on a polynomial of degree t-1, you can recover the polynomial exactly. Secret sharing turns this around:

1. Pick a random polynomial p(x) of degree t-1 over a finite field, with p(0) = secret.
2. Distribute n shares: share i is the pair (i, p(i)).
3. Recovery: gather any t shares, run Lagrange interpolation to find p(0).

```
p(0) = secret

p(x) = secret + a1*x + a2*x^2 + ... + a(t-1)*x^(t-1)

Shares:   party 1 gets (1, p(1))
          party 2 gets (2, p(2))
          ...
          party n gets (n, p(n))
```

Any t shares suffice. Any t-1 shares give no information: for every possible value of the secret, there exists a valid polynomial passing through those t-1 points. The shares are useless below threshold.

## Python implementation

```python
import secrets

PRIME = 2**127 - 1  # Mersenne prime; must be larger than the secret

def _eval_poly(coeffs, x):
    return sum(c * pow(x, i, PRIME) for i, c in enumerate(coeffs)) % PRIME

def _mod_inv(a):
    return pow(a, PRIME - 2, PRIME)  # Fermat's little theorem

def split(secret: int, n: int, t: int) -> list[tuple[int, int]]:
    """Split secret into n shares with reconstruction threshold t."""
    coeffs = [secret] + [secrets.randbelow(PRIME) for _ in range(t - 1)]
    return [(i, _eval_poly(coeffs, i)) for i in range(1, n + 1)]

def reconstruct(shares: list[tuple[int, int]]) -> int:
    """Reconstruct the secret from any t or more shares."""
    xs, ys = zip(*shares)
    result = 0
    for i, (xi, yi) in enumerate(zip(xs, ys)):
        num = yi
        den = 1
        for j, xj in enumerate(xs):
            if i != j:
                num = num * (PRIME - xj) % PRIME  # multiply by -xj mod prime
                den = den * (xi - xj) % PRIME
        result = (result + num * _mod_inv(den)) % PRIME
    return result
```

```python
# Example: 3-of-5 threshold
secret = 1234567890
shares = split(secret, n=5, t=3)

# Any 3 shares reconstruct the secret
assert reconstruct(shares[:3]) == secret
assert reconstruct(shares[1:4]) == secret
assert reconstruct([shares[0], shares[2], shares[4]]) == secret

# 2 shares reveal nothing (the math gives a different value for each subset)
```

## The finite field matters

Shamir's scheme must operate over a finite field, not the integers. If you use ordinary integers, partial information leaks: a share value larger than the prime reveals information about the secret's magnitude. Over GF(p) for prime p larger than the secret, every possible secret is equally consistent with any t-1 shares.

The prime must exceed the maximum secret value. A 256-bit secret requires a 256-bit prime.

## Verifiable Secret Sharing

Standard SSS requires trusting the dealer to distribute valid shares. Feldman VSS adds polynomial commitments: the dealer publishes (g^a0, g^a1, ...) where a0 = secret and a1...a(t-1) are the random coefficients. Each participant verifies their share without learning the secret:

```
Dealer publishes commitments:
  C0 = g^secret mod p
  C1 = g^a1 mod p
  ...
  C(t-1) = g^a(t-1) mod p

Party i verifies:
  g^share_i == C0 * C1^i * C2^(i^2) * ... mod p
```

If the check fails, the party knows the dealer cheated and can broadcast a complaint. The cheating dealer is identifiable and disqualified.

Pedersen VSS extends Feldman by adding a second random polynomial and a second generator h. This makes the commitments perfectly hiding: even a computationally unbounded attacker cannot extract the secret from the commitments alone.

## Share refresh

Shares accumulate risk over time. An attacker who compromises one party per year eventually reaches the threshold. Proactive secret sharing rotates shares without changing the secret: all parties run a sub-protocol that adds fresh random polynomials summing to zero, so each party gets a new share encoding the same secret. An attacker must compromise t parties within the same rotation window to succeed.

## Packed secret sharing

Standard SSS encodes one secret per polynomial. Packed secret sharing encodes multiple secrets as the evaluations of the polynomial at specific points, amortizing communication cost when sharing many secrets at once. Used in high-throughput MPC protocols.

## Use cases

- **Crypto exchange cold storage**: signing keys split across geographically separated HSMs with a 3-of-5 threshold
- **Password managers**: master key split across user device, provider server, and recovery service
- **PKI root CA ceremonies**: root signing key generated under a k-of-n officer quorum, never assembled on a single machine outside the ceremony
- **Ethereum DVT**: validator signing keys split across a node cluster; no single node can be slashed if compromised

## Gotchas

- **Shares must be treated as secret**: a share by itself is still sensitive. Leaking one share of a 2-of-5 scheme halves the attacker's remaining work.
- **Finite field size**: use a prime larger than your secret. A 256-bit secret needs a 256-bit prime (or larger).
- **Share indices are public**: the x-coordinates (party identities) are not secret. Only the y-coordinates (share values) are.
- **Dealer trust**: basic SSS requires trusting the dealer to generate shares correctly. Use VSS or DKG when the dealer is untrusted or you want no dealer at all.

## References

- [How to Share a Secret, Adi Shamir (1979)](https://dl.acm.org/doi/10.1145/359168.359176), the original paper
- [Non-Interactive and Information-Theoretic Secure Verifiable Secret Sharing, Feldman (1987)](https://doi.org/10.1109/SFCS.1987.4), Feldman VSS
- [Non-Interactive and Information-Theoretically Secure VSS, Pedersen (1991)](https://link.springer.com/chapter/10.1007/3-540-46766-1_9), Pedersen VSS
- [Secret Sharing Made Short, Krawczyk (1993)](https://link.springer.com/chapter/10.1007/3-540-48285-7_17), packed sharing and compression

## Related topics

- [Distributed Cryptography](../), the hub for this topic family
- [Multi-Party Computation](../multi-party-computation/), using shares to compute functions without revealing inputs
- [Distributed Key Generation](../distributed-key-generation/), generating keys under a share-based scheme from the start with no trusted dealer
- [Threshold Signatures](../threshold-signatures/), using shares to sign without reconstructing the key
