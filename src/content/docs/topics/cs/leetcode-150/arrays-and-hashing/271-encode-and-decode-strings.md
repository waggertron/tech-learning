---
title: "271. Encode and Decode Strings"
description: Design an encoding/decoding scheme for a list of strings, the inverse pair must be lossless.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, strings, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design an algorithm to encode a list of strings into a single string, and a second algorithm to decode the single string back to the original list. The strings can contain any valid ASCII characters including delimiters and digits.

**Example**
- Input: `["hello","world","foo","bar"]`
- `encoded = encode(["hello","world","foo","bar"])`
- `decoded = decode(encoded)` → `["hello","world","foo","bar"]`

LeetCode 271 (premium; free equivalent exists as **LC 659 / 1923**) · [Link](https://leetcode.com/problems/encode-and-decode-strings/) · *Medium*

## Approach 1: Brute force, single-char delimiter + escape

Pick a rare character as a delimiter, escape any occurrences in the source.

```python
def encode(strs: list[str]) -> str:
    # Use '\x1f' (unit separator) as delimiter; escape it in payloads
    return "\x1f".join(s.replace("\\", "\\\\").replace("\x1f", "\\u") for s in strs)

def decode(s: str) -> list[str]:
    result, parts = [], s.split("\x1f")
    return [p.replace("\\u", "\x1f").replace("\\\\", "\\") for p in parts]
```

**Complexity**
- **Time:** O(N) where N is the total number of characters (both encode and decode are linear in output size).
- **Space:** O(N).

Fragile: if the input can contain ANY ASCII (or Unicode), picking a "rare" delimiter is a footgun. This is how you get a "works in tests, breaks in prod" bug.

## Approach 2: JSON-serialize

Offload escaping to a proven serializer.

```python
import json

def encode(strs: list[str]) -> str:
    return json.dumps(strs)

def decode(s: str) -> list[str]:
    return json.loads(s)
```

**Complexity**
- **Time:** O(N).
- **Space:** O(N).

Correct and robust. Not typically accepted on LeetCode because the problem wants you to design the scheme, but worth knowing for real-world code, the right answer unless there's a reason to roll your own.

## Approach 3: Length-prefix encoding (optimal, self-delimiting)

Prefix each string with its length and a fixed delimiter (e.g., `#`). The length tells the decoder exactly how many characters to take next, no escaping needed.

```python
def encode(strs: list[str]) -> str:
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s: str) -> list[str]:
    result, i = [], 0
    while i < len(s):
        j = s.index('#', i)
        length = int(s[i:j])
        result.append(s[j + 1:j + 1 + length])
        i = j + 1 + length
    return result
```

**Complexity**
- **Time:** O(N). Each character is visited a constant number of times.
- **Space:** O(N).

This works for any character content, including the `#` delimiter, because the length prefix makes the scheme self-delimiting. The canonical interview answer.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Delimiter + escape | O(N) | O(N) | Fragile; easy to corrupt |
| JSON | O(N) | O(N) | Production-correct; not always accepted |
| **Length prefix** | **O(N)** | **O(N)** | Robust and self-delimiting |

Length-prefix encoding is the pattern behind many real-world formats, Pascal strings, netstrings, Protocol Buffers' length-delimited format, HTTP chunked encoding.

## Related data structures

- [Strings](../../../data-structures/strings/), input/output; immutability-aware concatenation
- [Arrays](../../../data-structures/arrays/), the list container being serialized
