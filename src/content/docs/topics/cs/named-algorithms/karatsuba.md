---
title: "Karatsuba multiplication"
description: "Sub-quadratic integer multiplication in O(n^1.585) by reducing three multiplications per level instead of four, and why this single observation cuts the naive O(n^2) cost."
parent: named-algorithms
tags: [algorithms, math, divide-and-conquer, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

## What it does

Given two large integers each with `n` digits, compute their product faster than the $O(n^2)$ schoolbook algorithm that every student learns.

Named after Anatoly Karatsuba, who discovered it in 1960 and published with Yuri Ofman in 1962. Before this result, it was widely believed that $O(n^2)$ was the theoretical lower bound for integer multiplication. Karatsuba showed that belief was wrong, and opened the door to a whole hierarchy of faster algorithms that culminates in near-linear FFT-based methods used in production today.

## The core idea, in one sentence

> Split each number into two halves, then use three multiplications (not four) to compute the product: the third sub-problem is a clever combination that lets you derive the cross-terms without extra work.

That one substitution, replacing four recursive calls with three, is the entire algorithm. Everything else is bookkeeping.

## The naive grade-school algorithm

Multiply two 4-digit numbers by hand and count the work. Split each number into a top half and a bottom half of 2 digits each:

```
x = 12 34   (a = 12, b = 34, so x = 12·10^2 + 34)
y = 56 78   (c = 56, d = 78, so y = 56·10^2 + 78)
```

To expand $x \cdot y = (a \cdot 10^m + b)(c \cdot 10^m + d)$:

```
= a·c · 10^(2m)
+ a·d · 10^m
+ b·c · 10^m
+ b·d
```

Four multiplications: `ac`, `ad`, `bc`, `bd`. The middle two (`ad` and `bc`) are the problem. They're independent, so you can't avoid either one with naive algebra. You need all four.

At each level of a divide-and-conquer recursion, you split again. The branching factor is 4, so the recurrence is `T(n) = 4T(n/2) + O(n)`. Master Theorem gives $O(n^2)$. Schoolbook, exactly.

## The Karatsuba identity

Given:

```
x = a · 10^m + b
y = c · 10^m + d
```

Define three quantities computed with three multiplications:

```
z2 = a · c
z0 = b · d
z1 = (a + b)(c + d) - z2 - z0
```

Then:

```
x · y = z2 · 10^(2m) + z1 · 10^m + z0
```

The key: `z1` is not a separate multiplication. It reuses `z2` and `z0`, both already computed. The `(a+b)(c+d)` expands to `ac + ad + bc + bd`. Subtracting `z2 = ac` and `z0 = bd` leaves exactly `ad + bc`, the cross-term we need, at the cost of one multiplication instead of two. Three multiplications total, not four.

This identity is algebraically exact. No approximation. No loss of precision.

## Python implementation

```python
def karatsuba(x, y):
    """Multiply two non-negative integers using Karatsuba's algorithm."""
    # Base case: fall back to built-in multiplication for small numbers.
    # In production this threshold would be tuned per platform.
    if x < 10 or y < 10:
        return x * y

    # Determine split point: half the number of digits in the larger operand.
    m = max(len(str(x)), len(str(y))) // 2

    # Split x into a (high) and b (low): x = a * 10^m + b
    power = 10 ** m
    a, b = divmod(x, power)
    c, d = divmod(y, power)

    # Three recursive multiplications.
    z2 = karatsuba(a, c)           # high * high
    z0 = karatsuba(b, d)           # low  * low
    z1 = karatsuba(a + b, c + d) - z2 - z0  # cross term

    return z2 * (power ** 2) + z1 * power + z0
```

The recursion bottoms out at single-digit numbers (or near-single-digit, depending on the threshold). Each level splits the problem into three sub-problems of half the size, plus $O(n)$ work for the additions and shifts.

### Notes on the implementation

- `divmod(x, power)` splits `x` into its top and bottom halves at digit `m`. No string manipulation needed.
- The power-of-ten shifts (`* power` and `* power ** 2`) are cheap: they're digit shifts, $O(n)$ work.
- The threshold `x < 10 or y < 10` is deliberately small here for clarity. In a production library like GNU MP, the cutoff is around 32 to 64 machine words, tuned empirically.

## Walk through: 1234 x 5678

Let `x = 1234`, `y = 5678`. `m = 2` (half of 4 digits).

Split:
```
a = 12,  b = 34   (1234 = 12 * 100 + 34)
c = 56,  d = 78   (5678 = 56 * 100 + 78)
```

Three sub-problems:

**Sub-problem z2 = 12 x 56:**
```
m = 1, a2=1, b2=2, c2=5, d2=6
z2_inner  = 1*5  = 5
z0_inner  = 2*6  = 12
z1_inner  = (1+2)*(5+6) - 5 - 12 = 3*11 - 17 = 33 - 17 = 16
12 * 56   = 5*100 + 16*10 + 12 = 500 + 160 + 12 = 672
```

**Sub-problem z0 = 34 x 78:**
```
m = 1, a3=3, b3=4, c3=7, d3=8
z2_inner  = 3*7  = 21
z0_inner  = 4*8  = 32
z1_inner  = (3+4)*(7+8) - 21 - 32 = 7*15 - 53 = 105 - 53 = 52
34 * 78   = 21*100 + 52*10 + 32 = 2100 + 520 + 32 = 2652
```

**Sub-problem z1 = (12+34) x (56+78) = 46 x 134:**
```
m = 1 (half of max(2,3) = 1)
a4=4, b4=6, c4=13, d4=4  (134 = 13*10 + 4)
z2_inner  = 4*13  = 52
z0_inner  = 6*4   = 24
z1_inner  = (4+6)*(13+4) - 52 - 24 = 10*17 - 76 = 170 - 76 = 94
46 * 134  = 52*100 + 94*10 + 24 = 5200 + 940 + 24 = 6164
z1        = 6164 - 672 - 2652 = 2840
```

**Combine:**
```
x * y = z2 * 10^4 + z1 * 10^2 + z0
      = 672 * 10000 + 2840 * 100 + 2652
      = 6720000 + 284000 + 2652
      = 7006652
```

Check: `1234 * 5678 = 7,006,652`. Correct.

The three sub-problems at the top level were multiplying 2-digit numbers. Those each recursed one more level into 1-digit multiplications. Total leaf multiplications: 9 (three sub-problems, each recursing into three). Schoolbook would need 16 leaf multiplications for 4-digit inputs.

### The recursion tree

For a 4-digit input, the recursion tree has two levels below the root:

```
Level 0 (root):   karatsuba(1234, 5678)
                  /          |           \
Level 1:    k(12,56)      k(46,134)    k(34,78)
            / | \          / | \        / | \
Level 2:  1-digit multiplications (base case)
```

At level 1, three calls. At level 2, three calls each = nine leaf multiplications total.

With schoolbook, each level-1 sub-problem would recurse into four calls, giving 4*4 = 16 leaf multiplications. Karatsuba: 9. The ratio at this small size is already 9/16 = 0.56. It gets better as n grows: at 8-digit inputs the ratio is 27/64 = 0.42, and it keeps shrinking toward zero as n -> infinity.

## Complexity analysis

The recurrence for Karatsuba is:

$$T(n) = 3 \cdot T(n/2) + O(n)$$

The $O(n)$ term covers the additions, subtractions, and digit-shift operations at each level.

Apply the **Master Theorem**: $T(n) = a \cdot T(n/b) + f(n)$ with $a = 3$, $b = 2$, $f(n) = O(n)$.

Compare $f(n) = O(n)$ against $n^{\log_b a} = n^{\log_2 3} \approx n^{1.585}$.

Since $f(n) = O(n^{1.585} / n^{0.585}) = O(n^{1.585 - 0.585})$ which is polynomially smaller than $n^{\log_2 3}$, we fall into Master Theorem Case 1:

$$T(n) = O(n^{\log_2 3}) = O(n^{1.585})$$

Compare this to the schoolbook $O(n^2)$. The branching factor 4 vs 3 is what drives the difference: $\log_2(4) = 2$ exactly, $\log_2(3) \approx 1.585$.

### Concrete operation counts

For `n = 1000` digits (typical for RSA-2048, which uses ~300-digit primes):

| Algorithm | Approximate operations |
| --- | --- |
| Schoolbook $O(n^2)$ | 1,000,000 |
| Karatsuba $O(n^{1.585})$ | ~50,000 |
| Ratio | ~20x fewer |

For `n = 10,000` digits (common in high-precision libraries):

| Algorithm | Approximate operations |
| --- | --- |
| Schoolbook $O(n^2)$ | 100,000,000 |
| Karatsuba $O(n^{1.585})$ | ~500,000 |
| Ratio | ~200x fewer |

The gap widens as `n` grows because the exponent difference (2.0 vs 1.585) compounds. For library-scale big-integer arithmetic, this is not a micro-optimization. It's a qualitative change in what's tractable.

## Why this matters

### Cryptography

RSA, Diffie-Hellman, and elliptic-curve protocols all require modular exponentiation over large integers. A 2048-bit RSA key uses 617-digit numbers. Repeated multiplication at that scale during key generation, signing, and verification makes the constant factor in multiplication's complexity directly user-visible.

### Big-number libraries

CPython's built-in `int` type uses Karatsuba automatically above a threshold of roughly 70 decimal digits (about 23 "digits" in Python's internal base-2^30 representation). You can observe this indirectly: multiplying two 100-digit numbers is faster than the schoolbook model would predict.

GNU MP (GMP), the most widely used arbitrary-precision library (used by Python, Sage, GCC, and hundreds of other projects), uses a layered strategy: schoolbook for very small inputs, Karatsuba for medium inputs, Toom-Cook 3-way and 4-way for larger inputs, and Schönhage-Strassen (FFT-based) for very large inputs. Karatsuba is the first threshold past schoolbook.

### Historical significance

Karatsuba's 1962 result disproved a conjecture Kolmogorov had just made in 1960 at a seminar: that $O(n^2)$ was a fundamental lower bound for multiplication. Karatsuba was a student in the audience and produced a counterexample within a week. The result showed that divide-and-conquer could break algebraic lower bounds that seemed obvious. It seeded the entire field of fast arithmetic.

## The base case and the threshold

Naive multiplication is actually faster for small `n`. Every recursive call has overhead: function call, splitting, addition, subtraction. For small inputs, that overhead dominates the savings from fewer multiplications.

The crossover point depends on:

- Word size of the machine (64-bit multiplications are essentially free)
- Cache effects (keeping data in L1 matters more than reducing theoretical op count)
- Whether the numbers fit in machine words at all

Real implementations (GMP, Python's `longobject.c`) measure empirically and hardcode a threshold. Python's threshold is approximately 70 decimal digits. GMP's is around 22-32 GMP limbs (machine words). Below the threshold, schoolbook wins.

In the toy implementation above, the threshold `x < 10` is intentionally small to make the recursion visible. In production you'd write:

```python
KARATSUBA_THRESHOLD = 10 ** 70  # rough approximation; tune per machine

def karatsuba(x, y):
    if x < KARATSUBA_THRESHOLD or y < KARATSUBA_THRESHOLD:
        return x * y  # fall back to Python's built-in (which *is* Karatsuba for large x*y)
    # ... rest as above
```

(Note: for a pure-Python demonstration, using Python's built-in `*` for the base case is circular since Python itself uses Karatsuba. The point is just showing the structure.)

## Variants and successors

The Karatsuba result launched a research program. Each step reduces the exponent further.

### Toom-Cook (generalization)

Toom-Cook splits each number into `k` pieces instead of 2. With `k` pieces you need `2k - 1` multiplications instead of `k^2`. Karatsuba is the special case `k = 2` (giving `2*2 - 1 = 3` multiplications).

Toom-Cook 3 (Toom-3) splits into 3 pieces and uses 5 multiplications. Its complexity is $O(n^{\log_3 5})$ = $O(n^{1.465})$. GMP uses Toom-3, Toom-4, and Toom-8 for progressively larger inputs.

The tradeoff: more pieces means more complex evaluation and interpolation code, and a larger constant factor. At some input size the next level becomes worth it.

### Schönhage-Strassen (FFT-based)

At very large sizes (millions of digits), even Toom-Cook isn't fast enough. The Schönhage-Strassen algorithm (1971) converts integer multiplication into polynomial multiplication via the Fast Fourier Transform, achieving $O(n log n log log n)$. GMP switches to this for inputs above roughly 1,000 GMP limbs.

### Harvey-Hoeven (2019)

The current theoretical record is $O(n log n)$, achieved by Harvey and van der Hoeven in 2019. It's not yet practical at typical sizes because the constant factors and implementation complexity are enormous, but it's the asymptotic optimum if you believe a conjectured lower bound of Omega(n log n).

### Summary of the hierarchy

| Algorithm | Complexity | Practical use |
| --- | --- | --- |
| Schoolbook | $O(n^2)$ | Small inputs, hardware |
| Karatsuba | $O(n^{1.585})$ | Medium inputs (~70-1000 digits) |
| Toom-Cook 3 | $O(n^{1.465})$ | Large inputs |
| Schönhage-Strassen | $O(n log n log log n)$ | Very large (millions of digits) |
| Harvey-Hoeven | $O(n log n)$ | Theoretical; not practical yet |

## When CPython uses Karatsuba

Python's `int` type is arbitrary precision. Under the hood, `longobject.c` uses base 2^30 "digits." The Karatsuba threshold is `70 * 2^30` in value terms, which corresponds to approximately 70 of Python's internal digits.

You can observe the speedup at scale:

```python
import time

# Generate two large integers with the specified number of Python digits
def time_multiply(num_digits):
    import random
    x = random.getrandbits(30 * num_digits)
    y = random.getrandbits(30 * num_digits)
    start = time.perf_counter()
    for _ in range(100):
        _ = x * y
    return (time.perf_counter() - start) / 100

for nd in [10, 50, 100, 200, 500]:
    t = time_multiply(nd)
    print(f"{nd:4d} digits: {t*1e6:.1f} us")
```

Above roughly 70 digits, the observed scaling will be closer to n^1.585 than n^2. You won't see a sharp step function because the threshold triggers at the top level and sub-problems switch back to schoolbook as they shrink.

## Interview and recognition patterns

Karatsuba rarely appears as a direct "implement this" interview question, but the underlying ideas show up in several forms.

### When an interviewer is thinking about Karatsuba

- "How would you multiply two very large integers that don't fit in a machine word?"
- "Can you do better than $O(n^2)$ for polynomial multiplication?" (Polynomial multiplication is structurally identical: `(a·x + b)(c·x + d) = ac·x^2 + (ad+bc)·x + bd`, three coefficients from three products.)
- "How does Python handle arbitrarily large integers?" (Answer includes: Karatsuba above a threshold.)
- Any question about big integer arithmetic in a systems or cryptography context.

### The pattern to recognize

> You have a product `(A + B)(C + D)` that expands to four terms. You already know two of those terms from other sub-problems. The expansion minus those two known terms gives you the cross-terms for free.

This "subtract what you already know" trick generalizes. It's the same idea in:

- Strassen's matrix multiplication (7 multiplications instead of 8 for 2x2 blocks)
- Polynomial evaluation at special points (Toom-Cook, FFT)
- Any divide-and-conquer where the cross-interaction between halves can be derived rather than computed independently

The mental model: **if you have two sub-results and you can get a third sub-result that "contains" both plus the cross-term, subtraction extracts the cross-term for free.**

### What it is not

- Not dynamic programming: no overlapping sub-problems being memoized, just a clean split
- Not greedy: no locally optimal choice; the split is fixed at n/2
- Not $O(n log n)$: that requires FFT. Karatsuba is strictly slower than Schönhage-Strassen for very large n

## Multiple uses

**Polynomial multiplication** - Two polynomials of degree n are coefficient lists of length n+1. Multiply using the same split-and-combine strategy. Karatsuba reduces 4 sub-multiplications to 3, giving $O(n^{1.585})$ vs $O(n^2)$ naive convolution (for sizes where FFT isn't worth it).

```python
def poly_karatsuba(a, b):
    """Multiply two polynomials represented as coefficient lists (index = degree).
    Returns coefficient list of the product."""
    n, m = len(a), len(b)
    if n == 1:
        return [a[0] * bj for bj in b]
    if m == 1:
        return [b[0] * ai for ai in a]

    half = max(n, m) // 2
    # Split: a = a_hi * x^half + a_lo
    a_lo, a_hi = a[:half], a[half:]
    b_lo, b_hi = b[:half], b[half:]

    # Pad shorter halves with zeros so addition is element-wise
    def pad(p, length):
        return p + [0] * (length - len(p))

    size = max(len(a_lo), len(a_hi), len(b_lo), len(b_hi))
    a_lo, a_hi = pad(a_lo, size), pad(a_hi, size)
    b_lo, b_hi = pad(b_lo, size), pad(b_hi, size)

    z0 = poly_karatsuba(a_lo, b_lo)
    z2 = poly_karatsuba(a_hi, b_hi)
    a_sum = [x + y for x, y in zip(a_lo, a_hi)]
    b_sum = [x + y for x, y in zip(b_lo, b_hi)]
    z1_raw = poly_karatsuba(a_sum, b_sum)
    # z1 = z1_raw - z2 - z0
    def poly_sub(p, q):
        result = list(p)
        for i, v in enumerate(q):
            if i < len(result):
                result[i] -= v
            else:
                result.append(-v)
        return result
    z1 = poly_sub(poly_sub(z1_raw, z2), z0)

    # Combine: result[i] += z0[i], result[i+half] += z1[i], result[i+2*half] += z2[i]
    size_out = n + m - 1
    result = [0] * size_out
    for i, v in enumerate(z0):
        if i < size_out:
            result[i] += v
    for i, v in enumerate(z1):
        if i + half < size_out:
            result[i + half] += v
    for i, v in enumerate(z2):
        if i + 2 * half < size_out:
            result[i + 2 * half] += v
    return result

# (1 + 2x)(3 + 4x) = 3 + 10x + 8x^2
# poly_karatsuba([1, 2], [3, 4]) -> [3, 10, 8]
```

**Big integer exponentiation (modular)** - RSA and other crypto systems need modular exponentiation of 2048-bit numbers. The repeated squaring loop calls big-integer multiplication at each step; Karatsuba makes each multiplication faster.

```python
def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y
    m = max(len(str(x)), len(str(y))) // 2
    power = 10 ** m
    a, b = divmod(x, power)
    c, d = divmod(y, power)
    z2 = karatsuba(a, c)
    z0 = karatsuba(b, d)
    z1 = karatsuba(a + b, c + d) - z2 - z0
    return z2 * (power ** 2) + z1 * power + z0

def mod_pow(base, exp, mod):
    """Modular exponentiation using repeated squaring.
    Each squaring step uses Karatsuba internally for large bases."""
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = karatsuba(result, base) % mod
        exp //= 2
        base = karatsuba(base, base) % mod
    return result

# Example: RSA-style computation with large primes
# mod_pow(base=123456789, exp=65537, mod=10**18 + 9)
```

**Matrix multiplication of polynomial-entry matrices** - Matrices where each entry is a polynomial (common in coding theory and error correction). Karatsuba applies to each scalar multiplication inside the matrix product.

```python
def poly_mul_naive(a, b):
    """Naive O(n^2) polynomial multiply, for comparison."""
    result = [0] * (len(a) + len(b) - 1)
    for i, ai in enumerate(a):
        for j, bj in enumerate(b):
            result[i + j] += ai * bj
    return result

def poly_add(a, b):
    size = max(len(a), len(b))
    result = [0] * size
    for i, v in enumerate(a):
        result[i] += v
    for i, v in enumerate(b):
        result[i] += v
    return result

def matrix_poly_mul(A, B):
    """Multiply two matrices whose entries are polynomials.
    A is (r x n), B is (n x c). Each entry is a coefficient list."""
    r, n, c = len(A), len(B), len(B[0])
    C = [[[] for _ in range(c)] for _ in range(r)]
    for i in range(r):
        for j in range(c):
            acc = [0]
            for k in range(n):
                # Use Karatsuba for each entry multiplication
                product = poly_karatsuba(A[i][k], B[k][j])
                acc = poly_add(acc, product)
            C[i][j] = acc
    return C

# A = [[[1, 1], [0, 1]]]  (1x2 matrix, entries are polynomials)
# B = [[[1, 0]], [[1, 1]]]  (2x1 matrix)
# C = A @ B uses Karatsuba for each polynomial product
```

## Test cases

```python
def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y
    m = max(len(str(x)), len(str(y))) // 2
    power = 10 ** m
    a, b = divmod(x, power)
    c, d = divmod(y, power)
    z2 = karatsuba(a, c)
    z0 = karatsuba(b, d)
    z1 = karatsuba(a + b, c + d) - z2 - z0
    return z2 * (power ** 2) + z1 * power + z0

def _run_tests():
    # Basic correctness against Python's built-in
    assert karatsuba(1234, 5678) == 1234 * 5678 == 7006652
    assert karatsuba(99, 99) == 9801
    assert karatsuba(0, 12345) == 0
    assert karatsuba(1, 99999) == 99999
    assert karatsuba(10, 10) == 100

    # Single-digit inputs (base case)
    assert karatsuba(7, 8) == 56
    assert karatsuba(9, 9) == 81

    # Larger inputs that require multiple levels of recursion
    assert karatsuba(123456789, 987654321) == 123456789 * 987654321
    assert karatsuba(999999999, 999999999) == 999999999 ** 2

    # Asymmetric sizes
    assert karatsuba(3, 9999) == 3 * 9999
    assert karatsuba(9999, 3) == 9999 * 3

    # Powers of ten (edge case for digit-split logic)
    assert karatsuba(100, 200) == 20000
    assert karatsuba(1000, 1000) == 1_000_000

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## References

- Karatsuba, A., and Ofman, Yu. (1962). "Multiplication of Many-Digital Numbers by Automatic Computers." *Doklady Akademii Nauk SSSR*, 145(2): 293-294. The original paper.
- Knuth, D. E. (1997). *The Art of Computer Programming*, Vol. 2: Seminumerical Algorithms, 3rd ed. Section 4.3.3 covers Karatsuba and Toom-Cook in detail.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C. (2022). *Introduction to Algorithms*, 4th ed. Chapter on divide-and-conquer includes the recurrence analysis.
- Granlund, T., and the GMP development team. *GNU Multiple Precision Arithmetic Library* (GMP). [https://gmplib.org/](https://gmplib.org/). Source code shows the practical thresholds and layered algorithm selection.

## Related topics

- [Merge sort](../merge-sort/), the canonical divide-and-conquer example with the same $O(n log n)$ recurrence structure
- [Quickselect](../quickselect/), another divide-and-conquer algorithm where the analysis depends critically on the branching factor
- [Data structures](../../data-structures/), background on how integers are represented in memory at the level these algorithms operate on
