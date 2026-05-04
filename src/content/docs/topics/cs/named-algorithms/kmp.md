---
title: "Knuth-Morris-Pratt (KMP)"
description: "Linear-time substring search by precomputing a failure function that tells you how far to slide the pattern on a mismatch, so no character in the text is ever inspected twice."
parent: named-algorithms
tags: [algorithms, strings, pattern-matching, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given a text string `T` of length `n` and a pattern string `P` of length `m`, find every position in `T` where `P` occurs as a substring.

KMP solves this in **O(n + m)** time: O(m) to preprocess the pattern, O(n) to scan the text. It never inspects the same character of the text more than once. Contrast with the naive approach, which is O(nm) in the worst case.

Named after Donald Knuth, Vaughan Pratt, and James Morris, who independently discovered the same algorithm and published it jointly in 1977. It remains the canonical interview answer for "implement substring search without using built-ins."

## The core idea, in one sentence

> On a mismatch, don't reset the pattern pointer back to zero: use the failure function to jump to the longest prefix of the pattern that is also a suffix of what you have matched so far, so the text pointer never moves backward.

That one insight is the whole algorithm. Everything else is bookkeeping.

## Why naive search is O(nm)

The naive algorithm slides the pattern one position at a time and restarts from the beginning of the pattern on every mismatch:

```python
def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    results = []
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:
            results.append(i)
    return results
```

Each outer iteration can do up to `m` comparisons. With `n - m + 1` starting positions, the worst case is O(nm).

The adversarial input that actually triggers O(nm): search for pattern `"aaab"` inside text `"aaa...aaa"` (all `a`s, no `b`). Every starting position matches the first `m-1` characters and fails only on the last one. With n = 10,000 and m = 100, that's nearly a million character comparisons for a search that returns no matches.

```
text:    a a a a a a a a a ...
pattern: a a a b
         ^ ^ ^ X  (fail at position 3, slide one, repeat)
             a a a b
             ^ ^ ^ X  (fail again)
```

KMP would handle this in O(n + m) by recognizing that after the failure at `b`, the prefix `"aaa"` is also a suffix of what was matched, so the pattern pointer jumps back only as far as necessary, not all the way to zero.

## The failure function (LPS array)

The failure function, also called the **LPS array** (Longest Proper Prefix which is also a Suffix), is the core of KMP. It is an array of length `m` where:

```
lps[i] = length of the longest proper prefix of pattern[0..i]
         that is also a suffix of pattern[0..i]
```

"Proper" means the prefix cannot be the full string itself.

Example for `pattern = "ABABCABAB"`:

```
index:   0 1 2 3 4 5 6 7 8
pattern: A B A B C A B A B
lps:     0 0 1 2 0 1 2 3 4
```

What `lps[7] = 3` means: the substring `"ABABCABA"` (indices 0-7) has a longest proper prefix-that-is-also-a-suffix of length 3, which is `"ABA"`. Both the prefix `pattern[0:3]` and the suffix `pattern[5:8]` are `"ABA"`.

What `lps[i]` tells the search algorithm: if you are at pattern position `i+1` and hit a mismatch, you already know that the last `lps[i]` characters of the text match the first `lps[i]` characters of the pattern. So instead of restarting from pattern position 0, restart from pattern position `lps[i]`. No text characters are wasted.

### Building the LPS array in O(m)

```python
def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0   # length of the current longest prefix-suffix
    i = 1        # lps[0] is always 0, start from index 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                # Don't increment i. Fall back using the lps value
                # for the previous longest prefix-suffix.
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    return lps
```

Two pointers: `i` scans the pattern left to right and never moves backward. `length` tracks the current candidate prefix-suffix length and can decrease, but the total number of decreases across the whole loop is bounded by the total number of increases, which is at most `m`. So the loop is O(m) overall.

## The search algorithm

With `lps` in hand, the search is a single left-to-right scan of the text:

```python
def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return []

    lps = build_lps(pattern)
    results = []

    i = 0   # text pointer (never moves backward)
    j = 0   # pattern pointer

    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        else:
            if j != 0:
                # Mismatch after j matches: consult the failure function.
                # We already know text[i-j:i] == pattern[0:j], so we
                # know text[i-lps[j-1]:i] == pattern[0:lps[j-1]].
                # Jump pattern pointer; do NOT move i.
                j = lps[j - 1]
            else:
                # Mismatch at j=0: nothing matches, advance text pointer.
                i += 1

        if j == m:
            # Full match found ending at i-1 in the text.
            results.append(i - m)
            j = lps[j - 1]   # look for overlapping matches

    return results
```

The critical property: `i` only ever increases. `j` can decrease (on a mismatch via `lps`), but each decrease is paid for by a prior increase of `j`. The total number of changes to `j` across the whole search is O(n). Combined with the O(n) increases of `i`, the search is O(n).

## Step-by-step: building LPS for "ABABCABAB"

Pattern: `A B A B C A B A B`

Start: `lps = [0, 0, 0, 0, 0, 0, 0, 0, 0]`, `length = 0`, `i = 1`.

```
i=1: pattern[1]='B' vs pattern[0]='A'  -> no match, length==0, lps[1]=0, i=2
     lps: [0, 0, 0, 0, 0, 0, 0, 0, 0]

i=2: pattern[2]='A' vs pattern[0]='A'  -> match! length=1, lps[2]=1, i=3
     lps: [0, 0, 1, 0, 0, 0, 0, 0, 0]

i=3: pattern[3]='B' vs pattern[1]='B'  -> match! length=2, lps[3]=2, i=4
     lps: [0, 0, 1, 2, 0, 0, 0, 0, 0]

i=4: pattern[4]='C' vs pattern[2]='A'  -> no match, length=2 != 0
     fall back: length = lps[2-1] = lps[1] = 0
     pattern[4]='C' vs pattern[0]='A'  -> no match, length==0, lps[4]=0, i=5
     lps: [0, 0, 1, 2, 0, 0, 0, 0, 0]

i=5: pattern[5]='A' vs pattern[0]='A'  -> match! length=1, lps[5]=1, i=6
     lps: [0, 0, 1, 2, 0, 1, 0, 0, 0]

i=6: pattern[6]='B' vs pattern[1]='B'  -> match! length=2, lps[6]=2, i=7
     lps: [0, 0, 1, 2, 0, 1, 2, 0, 0]

i=7: pattern[7]='A' vs pattern[2]='A'  -> match! length=3, lps[7]=3, i=8
     lps: [0, 0, 1, 2, 0, 1, 2, 3, 0]

i=8: pattern[8]='B' vs pattern[3]='B'  -> match! length=4, lps[8]=4, i=9
     lps: [0, 0, 1, 2, 0, 1, 2, 3, 4]
```

Final LPS array:

```
index:   0 1 2 3 4 5 6 7 8
pattern: A B A B C A B A B
lps:     0 0 1 2 0 1 2 3 4
```

## Step-by-step: searching for "ABAB" in "ABABDABAAB"

Pattern: `A B A B`, LPS: `[0, 0, 1, 2]`

```
text:    A B A B D A B A A B
index:   0 1 2 3 4 5 6 7 8 9

i=0, j=0: text[0]='A' == pattern[0]='A'  -> i=1, j=1
i=1, j=1: text[1]='B' == pattern[1]='B'  -> i=2, j=2
i=2, j=2: text[2]='A' == pattern[2]='A'  -> i=3, j=3
i=3, j=3: text[3]='B' == pattern[3]='B'  -> i=4, j=4

j == m=4: MATCH at index i-m = 4-4 = 0
          j = lps[3] = 2  (continue looking for overlapping matches)

i=4, j=2: text[4]='D' vs pattern[2]='A'  -> mismatch, j != 0
          j = lps[1] = 0

i=4, j=0: text[4]='D' vs pattern[0]='A'  -> mismatch, j==0, i=5

i=5, j=0: text[5]='A' == pattern[0]='A'  -> i=6, j=1
i=6, j=1: text[6]='B' == pattern[1]='B'  -> i=7, j=2
i=7, j=2: text[7]='A' == pattern[2]='A'  -> i=8, j=3
i=8, j=3: text[8]='A' vs pattern[3]='B'  -> mismatch, j != 0
          j = lps[2] = 1

i=8, j=1: text[8]='A' vs pattern[1]='B'  -> mismatch, j != 0
          j = lps[0] = 0

i=8, j=0: text[8]='A' == pattern[0]='A'  -> i=9, j=1
i=9, j=1: text[9]='B' == pattern[1]='B'  -> i=10, j=2

i=10: loop ends (i == n=10)
```

Result: match at index 0. Text pointer `i` moved from 0 to 10, always forward. Pattern pointer `j` moved up and down but never caused `i` to go backward.

## Complexity

| Phase | Time | Space |
| --- | --- | --- |
| Preprocessing (build LPS) | O(m) | O(m) for LPS array |
| Search | O(n) | O(1) extra (just two pointers) |
| Total | O(n + m) | O(m) |

Compare to naive: O(nm) time, O(1) space. KMP trades O(m) space for a factor-of-m speedup in the worst case.

## Why the search is truly O(n): the key invariant

The argument rests on a potential function: let `phi = i + j`. At the start, `phi = 0`. At the end of the search, `phi <= 2n`.

- Each time `i` increases (a character match or a j=0 mismatch), `phi` increases by at most 2 (i by 1, j by at most 1).
- Each time `j` decreases via `lps` (a mismatch with j > 0), `phi` decreases because `j` strictly decreases (since `lps[j-1] < j` always) and `i` stays fixed.

Since `phi` can only decrease by something that was previously added through an increase, the total number of decreases of `j` across the entire search is bounded by the total number of increases of `i`, which is at most `n`. The outer while loop executes at most `2n` times total. That is O(n).

The same argument applies to `build_lps` with the analogous potential `i + length`, giving O(m).

## Applications beyond substring search

### Finding repeating units

KMP can determine whether a string is composed of a repeating unit (and find the shortest such unit) using just the LPS array.

If `lps[m-1] > 0` and `m % (m - lps[m-1]) == 0`, the string consists of repeated copies of its shortest unit, which has length `m - lps[m-1]`.

```python
def shortest_repeating_unit(s):
    lps = build_lps(s)
    m = len(s)
    unit_len = m - lps[m - 1]
    if m % unit_len == 0:
        return s[:unit_len]
    return s   # no repeating unit; the string itself is the unit

# "ABABABAB" -> lps[-1]=6, unit_len=8-6=2, "AB"
# "ABCABC"  -> lps[-1]=3, unit_len=6-3=3, "ABC"
# "ABCD"    -> lps[-1]=0, unit_len=4-4=4 -- wait, 4%4==0 is True but unit is whole string
```

This is the basis of LeetCode 459 (Repeated Substring Pattern).

### Checking if one string is a rotation of another

`S2` is a rotation of `S1` if and only if `S2` appears as a substring of `S1 + S1`. Run KMP to search for `S2` in `S1 + S1` (without constructing the doubled string if memory matters, or just concatenate for an interview).

```python
def is_rotation(s1, s2):
    if len(s1) != len(s2):
        return False
    doubled = s1 + s1
    return bool(kmp_search(doubled, s2))

# is_rotation("abcde", "cdeab") -> True  ("ab" rotated two positions)
# is_rotation("abcde", "abced") -> False
```

This works because every rotation of `S1` is a contiguous substring of `S1 + S1`.

## KMP vs other string search algorithms

| Algorithm | Preprocessing | Search | Notes |
| --- | --- | --- | --- |
| Naive | None | O(nm) worst case | Fine for small m or random text |
| KMP | O(m) | O(n) | Guaranteed linear; interview standard |
| Rabin-Karp | O(m) | O(n) average | Uses rolling hash; simpler code but hash collisions require fallback |
| Boyer-Moore | O(m + alphabet) | O(n/m) best case | Fastest in practice for large alphabets; harder to implement correctly |
| Z-algorithm | O(n + m) | (combined) | Similar guarantees to KMP, arguably simpler to derive |

**When to use KMP:**

- Interview problems asking you to implement substring search (LeetCode 28).
- When you need guaranteed worst-case O(n) and don't want to reason about hash collisions (Rabin-Karp) or Boyer-Moore's complex bad-character and good-suffix tables.
- When the pattern contains many repeated characters (the adversarial case for naive; KMP handles it cleanly).

**When Rabin-Karp wins:**

- When you need to search for multiple patterns simultaneously (use a hash set of pattern hashes).
- When the code simplicity of the rolling hash matters more than the theoretical collision risk.

**When Boyer-Moore wins:**

- Production implementations where raw speed matters more than code clarity.
- Large alphabets (English text), where BM's bad-character heuristic can skip large chunks of text.

**Z-algorithm:**

The Z-algorithm builds a Z-array where `Z[i]` is the length of the longest substring starting at `i` that is also a prefix of the string. It solves the same problems as KMP (substring search, repeated units, rotation detection) and many people find it easier to derive from scratch. If you find LPS confusing to construct, the Z-algorithm is worth learning as the simpler alternative.

## LeetCode connections

Most string matching problems on LeetCode accept built-in `str.find()` or `in` operator in Python solutions, which call the underlying C implementation of a search algorithm. KMP shows up explicitly in:

- **LeetCode 28 (Find the Index of the First Occurrence in a String)**: the canonical "implement strstr" problem. KMP is the expected O(n + m) solution when the interviewer bans built-ins.
- **LeetCode 459 (Repeated Substring Pattern)**: determine if a string can be made by repeating a substring. Solvable directly from the LPS array (see the repeating unit section above) in O(n) with no search step needed.
- **LeetCode 686 (Repeated String Match)**: find how many times you must repeat `A` so that `B` is a substring. Build `A` repeated enough times and run KMP search. The LPS preprocessing saves time when `B` is much longer than `A`.

None of these pages may exist yet in this site's catalog; they live in the leetcode-150 subtopic tree.

## Test cases

```python
def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps


def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return []
    lps = build_lps(pattern)
    results = []
    i = 0
    j = 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
        if j == m:
            results.append(i - m)
            j = lps[j - 1]
    return results


def _run_tests():
    # Basic single match
    assert kmp_search("ABABDABAAB", "ABAB") == [0], "single match"

    # Pattern at end
    assert kmp_search("HELLO WORLD", "WORLD") == [6], "pattern at end"

    # No match
    assert kmp_search("AAAAAA", "B") == [], "no match"

    # Overlapping matches
    assert kmp_search("AAAA", "AA") == [0, 1, 2], "overlapping"

    # Adversarial input (naive would be O(nm) here)
    text = "a" * 1000 + "b"
    pattern = "a" * 10 + "b"
    assert kmp_search(text, pattern) == [990], "adversarial input"

    # Pattern equals text
    assert kmp_search("ABC", "ABC") == [0], "pattern equals text"

    # Pattern longer than text
    assert kmp_search("AB", "ABCD") == [], "pattern longer than text"

    # Multiple non-overlapping matches
    assert kmp_search("ABABABAB", "ABAB") == [0, 2, 4], "multiple matches"

    # Empty pattern
    assert kmp_search("ABC", "") == [], "empty pattern"

    # Single character
    assert kmp_search("AABABC", "A") == [0, 1, 3], "single char"

    # LPS array tests
    assert build_lps("ABABCABAB") == [0, 0, 1, 2, 0, 1, 2, 3, 4], "LPS ABABCABAB"
    assert build_lps("AABAABAAA") == [0, 1, 0, 1, 2, 3, 4, 5, 2], "LPS AABAABAAA"
    assert build_lps("ABCDE") == [0, 0, 0, 0, 0], "LPS no repeats"
    assert build_lps("AAAA") == [0, 1, 2, 3], "LPS all same"

    # Rotation check
    def is_rotation(s1, s2):
        if len(s1) != len(s2):
            return False
        return bool(kmp_search(s1 + s1, s2))

    assert is_rotation("abcde", "cdeab"), "rotation true"
    assert not is_rotation("abcde", "abced"), "rotation false"

    # Repeating unit
    def shortest_unit(s):
        lps = build_lps(s)
        m = len(s)
        unit_len = m - lps[m - 1]
        if m % unit_len == 0 and unit_len < m:
            return s[:unit_len]
        return s

    assert shortest_unit("ABABABAB") == "AB", "repeating unit AB"
    assert shortest_unit("ABCABC") == "ABC", "repeating unit ABC"
    assert shortest_unit("ABCD") == "ABCD", "no repeating unit"

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## References

- Knuth, D. E., Morris, J. H., & Pratt, V. R. (1977). Fast pattern matching in strings. *SIAM Journal on Computing*, 6(2), 323-350. The original paper.
- Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.), Chapter 5.3: Substring Search. The textbook treatment most people encounter first.
- [LeetCode 28, Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/)

## Related topics

- [Data Structures](../data-structures/), for the string and array primitives KMP operates on
- [BFS](./bfs/), another graph/tree algorithm where understanding the pointer invariant is the key insight
- Z-algorithm: a close sibling to KMP with arguably simpler derivation. It builds a Z-array (longest match with the prefix starting at each position) rather than an LPS array. Both solve substring search in O(n + m); KMP is more common in interviews, Z-algorithm is worth knowing as a mental cross-check.
