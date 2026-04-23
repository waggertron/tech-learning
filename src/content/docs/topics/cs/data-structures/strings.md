---
title: Strings
description: Sequences of characters — often "array problems in disguise," but with concerns around immutability, character sets, and specialized matching algorithms.
parent: data-structures
tags: [data-structures, strings, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A string is a sequence of characters, usually stored as an array of bytes (C), a length-prefixed array of code units (Java, Go, Rust), or an immutable object wrapping one (Python, JavaScript). Many interview problems are ostensibly string problems but fundamentally array problems — with the extra wrinkles of encoding (ASCII vs. UTF-8 vs. UTF-16), immutability, and specialized matching algorithms.

## In-depth description

**Immutability** matters for complexity analysis. In Python/Java/JS, naive `s = s + c` inside a loop is O(n²) because each concatenation creates a new string — use `StringBuilder` (Java), a list + `"".join()` (Python), or mutable byte buffers. In C and Rust, strings can be mutated in place but you own the memory and encoding.

**Character counting** is the most common string preprocessing step. For ASCII-only input a 128-element integer array outperforms a hash map. For Unicode, fall back to a dict/hash map. Sorting characters of a string is often the simplest anagram canonicalization — O(k log k) where k is string length.

**String matching algorithms** come up occasionally:

- **KMP (Knuth-Morris-Pratt)** — O(n + m) with a precomputed failure function.
- **Rabin-Karp** — polynomial rolling hash for fast multi-pattern and approximate matching.
- **Z-algorithm** — computes prefix-match lengths in O(n), simpler than KMP for some problems.
- **Manacher's algorithm** — finds the longest palindromic substring in O(n) (the O(n²) expand-around-center version is interview-standard).

**String DP** — edit distance, LCS, regex matching — is a recurring theme and one of the hardest interview topic areas.

## Time complexity

| Operation | Average | Worst |
| --- | --- | --- |
| Access by index | O(1) | O(1) |
| Concatenation (new string) | O(n + m) | O(n + m) |
| Substring check (naive) | O(n·m) | O(n·m) |
| Substring check (KMP / Z) | O(n + m) | O(n + m) |
| Comparison | O(min(n, m)) | O(min(n, m)) |
| Sort characters | O(k log k) | O(k log k) |
| Space | O(n) | O(n) |

## Common uses in DSA

1. **Anagrams and character frequency** — Valid Anagram, Group Anagrams, Find All Anagrams in a String.
2. **Palindrome detection** — Valid Palindrome, Longest Palindromic Substring (expand around center or Manacher's), Palindromic Substrings.
3. **Pattern matching** — Implement strStr() (needle in haystack), Repeated Substring Pattern, Find the Index of the First Occurrence.
4. **Sliding window on strings** — Longest Substring Without Repeating Characters, Minimum Window Substring, Longest Repeating Character Replacement.
5. **Edit distance and string DP** — Edit Distance, Longest Common Subsequence, Regular Expression Matching, Wildcard Matching.

**Canonical LeetCode problems:** #3 Longest Substring Without Repeating Characters, #5 Longest Palindromic Substring, #20 Valid Parentheses, #49 Group Anagrams, #76 Minimum Window Substring, #125 Valid Palindrome, #242 Valid Anagram.

## Python example

```python
from collections import Counter

# Immutability pitfall:
# BAD (O(n^2)):  s = ""; for c in chars: s += c
# GOOD (O(n)):   "".join(chars)

# Anagram check with Counter — O(n)
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Palindrome check with two pointers — O(n), skipping non-alphanumerics
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l, r = l + 1, r - 1
    return True

# Longest palindromic substring (expand around center) — O(n^2)
def longest_palindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l, r = l - 1, r + 1
        return s[l + 1:r]
    best = ""
    for i in range(len(s)):
        for cand in (expand(i, i), expand(i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best

# Longest substring without repeating characters (sliding window) — O(n)
def longest_unique(s):
    seen, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best

# Group Anagrams — hash by sorted string
def group_anagrams(words):
    from collections import defaultdict
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())
```

## LeetCode problems

**NeetCode 150 — Arrays & Hashing:**
- [242. Valid Anagram](../../leetcode-150/arrays-and-hashing/242-valid-anagram/)
- [49. Group Anagrams](../../leetcode-150/arrays-and-hashing/049-group-anagrams/)
- [271. Encode and Decode Strings](../../leetcode-150/arrays-and-hashing/271-encode-and-decode-strings/)

**NeetCode 150 — Two Pointers:**
- [125. Valid Palindrome](../../leetcode-150/two-pointers/125-valid-palindrome/)

**NeetCode 150 — Sliding Window:**
- [3. Longest Substring Without Repeating Characters](../../leetcode-150/sliding-window/003-longest-substring-without-repeating-characters/)
- [424. Longest Repeating Character Replacement](../../leetcode-150/sliding-window/424-longest-repeating-character-replacement/)
- [567. Permutation in String](../../leetcode-150/sliding-window/567-permutation-in-string/)
- [76. Minimum Window Substring](../../leetcode-150/sliding-window/076-minimum-window-substring/)

*More categories coming soon — DP on strings, etc.*

## References

- [KMP algorithm — Wikipedia](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
- [Rabin-Karp — Wikipedia](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm)
- [Manacher's algorithm — cp-algorithms](https://cp-algorithms.com/string/manacher.html)
- [String matching problems — LeetCode tag](https://leetcode.com/tag/string/)
