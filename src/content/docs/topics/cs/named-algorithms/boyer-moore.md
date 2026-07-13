---
title: "Boyer-Moore majority vote"
description: "Find the element that appears more than n/2 times in O(n) time and O(1) space by maintaining a candidate and a counter that cancel non-majority elements out."
parent: named-algorithms
tags: [algorithms, arrays, two-pointers, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

## What it does

Given an array of `n` elements, find the **majority element**: the one that appears **strictly more than `n/2` times**, in a single pass with constant extra memory.

Named after Robert S. Boyer and J Strother Moore, who described it in a 1981 technical report. It is the canonical answer to [LeetCode 169 (Majority Element)](https://leetcode.com/problems/majority-element/) and the seed of a whole family of "find the heavy hitter" problems in streaming algorithms.

Two properties must hold for the algorithm to be meaningful:

1. A majority element exists (appears more than `n/2` times).
2. You want $O(n)$ time and $O(1)$ space (otherwise a hash map or sort is fine).

If neither constraint matters, simpler approaches work. Boyer-Moore shines when both do.

## Core idea, in one sentence

> Pair every non-majority element with one majority element and cancel them out; because the majority appears more than `n/2` times, it always survives the cancellation.

That single insight drives everything else. The implementation is just a mechanical way to do those cancellations in one forward pass.

## Why naive approaches fall short

Before Boyer-Moore, the obvious answers:

**Sorting:** Sort the array and return `nums[n // 2]`. The majority element must occupy the middle index. Time is $O(n log n)$, space is $O(1)$ or $O(log n)$ depending on sort. Correct, but slower than necessary.

**Hash map frequency count:** Count occurrences of every element, then scan for the one with count > n/2. Time is $O(n)$, but space is $O(n)$ because you store every distinct element. Fine for small inputs, but the space blows up for large streaming data.

Boyer-Moore matches the hash map on time and beats both on space: $O(n)$ time, $O(1)$ space. It does this by not remembering all counts, just one candidate and one counter.

## The algorithm

```python
def majority_element(nums):
    candidate = None
    count = 0

    for x in nums:
        if count == 0:
            candidate = x      # reset: pick this element as the new candidate
        if x == candidate:
            count += 1         # same as candidate: strengthen it
        else:
            count -= 1         # different: cancel one out

    return candidate           # WARNING: only valid if a majority element exists
```

Two variables, one pass. No extra data structures.

The logic at each step:

- If `count` is zero, we have no current candidate. Adopt the current element.
- If the current element matches `candidate`, it reinforces it: increment.
- If the current element differs from `candidate`, it opposes it: decrement.

When the counter goes to zero, the current candidate has been completely cancelled out by opposing elements. Whatever comes next starts fresh.

## Why it works: the proof sketch

Claim: if a majority element `m` exists (count > n/2), it will be the `candidate` at the end.

Think of every decrement as a "cancellation event." One unit of the candidate and one opposing element are paired and erased from consideration. Two key observations:

1. **Non-majority elements cause every decrement.** A decrement happens only when the current element differs from `candidate`. That current element is, by definition, not `m` in that moment (or `m` is not candidate). Either way, each cancellation pairs at most one occurrence of `m` with one non-majority element.

2. **There aren't enough non-majority elements to cancel all of `m`.** The count of non-majority elements is at most `n/2 - 1` (since `m` appears more than `n/2` times, everything else totals fewer than `n/2` occurrences). So fewer than `n/2` cancellations can happen. Since `m` has more than `n/2` occurrences, at least one occurrence of `m` survives every possible cancellation.

Therefore, after all cancellations, the surviving candidate must be `m`.

A sharper way to state it: imagine the array split into pairs of `(m, non-m)`. Every such pair cancels to zero contribution. There are at most `n/2 - 1` non-majority elements, so at most `n/2 - 1` pairs. But `m` has more than `n/2` copies, so at least one copy of `m` is unpaired. It remains the candidate.

## Step-by-step walkthrough

Input: `[2, 2, 1, 1, 1, 2, 2]`

The majority element is `2` (appears 4 times out of 7).

| Step | Element | Action | candidate | count |
| ---- | ------- | ------ | --------- | ----- |
| 0    | 2       | count=0, adopt 2 | 2   | 1     |
| 1    | 2       | matches candidate | 2  | 2     |
| 2    | 1       | differs, decrement | 2 | 1     |
| 3    | 1       | differs, decrement | 2 | 0     |
| 4    | 1       | count=0, adopt 1 | 1   | 1     |
| 5    | 2       | differs, decrement | 1 | 0     |
| 6    | 2       | count=0, adopt 2 | 2   | 1     |

Final candidate: `2`. Correct.

Notice step 4: `1` temporarily became the candidate. This is fine. The algorithm does not track whether `1` is the "true" candidate, it just tracks the current survivor of cancellations. `1` got cancelled at step 5 and `2` reclaimed the position. The proof above guarantees `2` always wins in the end.

Also notice that the candidate at the end has `count = 1`, not `count = 4`. The count does not represent total occurrences of the majority element. It represents the "surplus" after all cancellations that happened while this particular candidate held the seat.

## The critical caveat: verification pass required

Boyer-Moore returns a **candidate**, not a confirmed majority element.

If no majority element exists in the array, the algorithm still returns something. It will be wrong, and you have no way to detect the failure without a second pass.

Example of a broken input: `[1, 2, 3]`. No element appears more than 1 time, let alone more than n/2 = 1.5 times.

```
Step 0: element=1, count=0 -> adopt 1, count=1
Step 1: element=2, differs -> count=0
Step 2: element=3, count=0 -> adopt 3, count=1
```

Returns `3`. But `3` appears once in three elements, nowhere near a majority.

**Always do a second pass to confirm:**

```python
def majority_element_verified(nums):
    # Pass 1: find the candidate
    candidate = None
    count = 0
    for x in nums:
        if count == 0:
            candidate = x
        if x == candidate:
            count += 1
        else:
            count -= 1

    # Pass 2: verify the candidate is actually a majority
    actual_count = nums.count(candidate)
    if actual_count > len(nums) // 2:
        return candidate
    return None   # no majority element exists
```

[LeetCode 169](https://leetcode.com/problems/majority-element/) guarantees a majority element exists, so the verification pass is not needed there. In production code, assume nothing and always verify.

The two-pass version is still $O(n)$ time, $O(1)$ space. The second pass is just a linear count, no extra storage.

## Complexity

| Metric | Cost |
| --- | --- |
| Time (pass 1) | $O(n)$ |
| Time (pass 2, verification) | $O(n)$ |
| Space | $O(1)$, two scalars only |

Nothing is stored per element. The `candidate` and `count` variables are the entire state.

Compare to the hash map approach:

| Approach | Time | Space |
| --- | --- | --- |
| Sort + middle | $O(n log n)$ | $O(1)$ or $O(log n)$ |
| Hash map count | $O(n)$ | $O(n)$ |
| Boyer-Moore | $O(n)$ | $O(1)$ |

Boyer-Moore dominates for space. It is the only approach that hits both $O(n)$ time and $O(1)$ space simultaneously.

## Variant: elements appearing more than n/3 times ([LeetCode 229](https://leetcode.com/problems/majority-element-ii/))

[LeetCode 229 (Majority Element II)](https://leetcode.com/problems/majority-element-ii/) asks for all elements appearing more than `n/3` times.

Key observation: at most **two** such elements can exist in any array (since three elements each appearing more than `n/3` times would sum to more than `n`).

The generalization of Boyer-Moore handles this by maintaining **two candidates** simultaneously:

```python
def majority_element_n3(nums):
    candidate1, candidate2 = None, None
    count1, count2 = 0, 0

    for x in nums:
        if x == candidate1:
            count1 += 1
        elif x == candidate2:
            count2 += 1
        elif count1 == 0:
            candidate1, count1 = x, 1
        elif count2 == 0:
            candidate2, count2 = x, 1
        else:
            count1 -= 1    # cancel one of each candidate
            count2 -= 1

    # Verification pass: confirm both candidates
    result = []
    for c in (candidate1, candidate2):
        if c is not None and nums.count(c) > len(nums) // 3:
            result.append(c)
    return result
```

The order of the `if` checks matters: always try to match an existing candidate before adopting a new one, and only decrement both when no slot is free and no match was found.

**The general rule:** to find all elements appearing more than `n/k` times, maintain `k-1` candidates. At most `k-1` such elements can exist. Each "cancellation event" involves one of each of the `k-1` candidates plus one new element (total `k` elements cancel together), so the majority survivors still emerge.

| Threshold | Candidates needed | Max survivors |
| --- | --- | --- |
| > n/2 | 1 | 1 |
| > n/3 | 2 | 2 |
| > n/4 | 3 | 3 |
| > n/k | k-1 | k-1 |

The verification pass remains mandatory for all variants.

## When it fails: counter-clues

Boyer-Moore is the wrong tool in several situations:

**No majority element guaranteed.** If you don't know whether a majority exists and can't afford to run the verification pass (e.g., true streaming with no second scan), you can get a wrong answer with no way to detect it.

**Threshold unknown.** The algorithm is designed for a specific threshold: more than `n/2`, or more than `n/k` for a fixed `k`. If you don't know the threshold in advance, you don't know how many candidates to maintain.

**Need actual counts.** Boyer-Moore tells you *which* element is the majority, not *how many times* it appears. For frequency information, you still need a hash map or second pass.

**Online stream with arbitrary threshold.** If you're processing a data stream and someone asks "what element appears more than 37% of the time?", Boyer-Moore with 2 candidates handles > n/3 = 33%, but 37% does not map to a clean threshold. You'd need a hash map or a sketch (like Count-Min sketch) instead.

**Multiple passes unavailable.** In some true streaming contexts you cannot make a second pass over the data. Boyer-Moore still gives you the best candidate possible, but you cannot confirm it.

If the problem says "find all elements with count > X" for arbitrary or unknown X, reach for a hash map, not Boyer-Moore.

## LeetCode exercise

[LeetCode 169 (Majority Element)](https://leetcode.com/problems/majority-element/) is the canonical exercise. The problem guarantees a majority exists, so no verification pass is needed and the single-pass version is accepted.

It is not in the Blind 75 / LeetCode 150 core list, but it appears frequently in interviews and is a natural companion to the arrays-and-hashing problems in the [Arrays and Hashing](../../coding-problems/arrays-and-hashing/) section.

[LeetCode 229 (Majority Element II)](https://leetcode.com/problems/majority-element-ii/) is the n/3 variant, covered in the section above.

## Multiple uses

**Streaming majority vote** - Process a stream of votes in real time without storing them. Classic use case: live election tallying where you cannot store every vote. Run the single-pass Boyer-Moore loop as votes arrive; the final candidate is the majority if one exists.

```python
def streaming_majority_vote(vote_stream):
    candidate = None
    count = 0
    for vote in vote_stream:          # vote_stream can be a generator
        if count == 0:
            candidate = vote
        if vote == candidate:
            count += 1
        else:
            count -= 1
    return candidate                  # verify with a second pass if existence is not guaranteed
```

**Finding elements appearing more than n/3 times (at most two exist)** - Two-candidate extension: maintain two (candidate, count) pairs. The first pass finds the surviving candidates using the same cancellation logic, extended to three-way cancellation. The second pass verifies both, because the first pass does not confirm frequency.

```python
def majority_n3(nums):
    c1, c2 = None, None
    k1, k2 = 0, 0
    for x in nums:
        if x == c1:
            k1 += 1
        elif x == c2:
            k2 += 1
        elif k1 == 0:
            c1, k1 = x, 1
        elif k2 == 0:
            c2, k2 = x, 1
        else:
            k1 -= 1          # cancel one of each candidate against the new element
            k2 -= 1
    # Verification pass
    threshold = len(nums) // 3
    return [c for c in (c1, c2) if c is not None and nums.count(c) > threshold]
```

**Safe message delivery with majority confirmation** - Distributed systems pattern: if a message is acknowledged by more than half the nodes, it must be the message the majority agreed on. Boyer-Moore is the algorithm behind the intuition. Run the vote loop over acknowledgment messages as they arrive; the surviving candidate is the message that, if a majority exists, the quorum confirmed.

```python
def majority_ack(ack_stream):
    candidate = None
    count = 0
    for msg in ack_stream:
        if count == 0:
            candidate = msg
        if msg == candidate:
            count += 1
        else:
            count -= 1
    return candidate   # if quorum is guaranteed, this is the agreed message
```

## Test cases

```python
def majority_element(nums):
    candidate = None
    count = 0
    for x in nums:
        if count == 0:
            candidate = x
        if x == candidate:
            count += 1
        else:
            count -= 1
    return candidate


def majority_element_verified(nums):
    candidate = None
    count = 0
    for x in nums:
        if count == 0:
            candidate = x
        if x == candidate:
            count += 1
        else:
            count -= 1
    actual_count = nums.count(candidate)
    if actual_count > len(nums) // 2:
        return candidate
    return None


def majority_element_n3(nums):
    candidate1, candidate2 = None, None
    count1, count2 = 0, 0
    for x in nums:
        if x == candidate1:
            count1 += 1
        elif x == candidate2:
            count2 += 1
        elif count1 == 0:
            candidate1, count1 = x, 1
        elif count2 == 0:
            candidate2, count2 = x, 1
        else:
            count1 -= 1
            count2 -= 1
    result = []
    for c in (candidate1, candidate2):
        if c is not None and nums.count(c) > len(nums) // 3:
            result.append(c)
    return result


def _run_tests():
    # Basic majority exists
    assert majority_element([3, 2, 3]) == 3
    assert majority_element([2, 2, 1, 1, 1, 2, 2]) == 2
    assert majority_element([1]) == 1
    assert majority_element([1, 1]) == 1
    assert majority_element([6, 5, 5]) == 5

    # All same element
    assert majority_element([7, 7, 7, 7]) == 7

    # Majority at the start
    assert majority_element([3, 3, 3, 1, 2]) == 3

    # Majority at the end
    assert majority_element([1, 2, 4, 4, 4]) == 4

    # Verified version: majority exists
    assert majority_element_verified([3, 2, 3]) == 3
    assert majority_element_verified([2, 2, 1, 1, 1, 2, 2]) == 2

    # Verified version: no majority element
    assert majority_element_verified([1, 2, 3]) is None
    assert majority_element_verified([1, 2, 1, 2]) is None

    # n/3 variant
    assert sorted(majority_element_n3([3, 2, 3])) == [2, 3] or \
           sorted(majority_element_n3([3, 2, 3])) == [3]
    assert sorted(majority_element_n3([1, 1, 1, 3, 3, 2, 2, 2])) == [1, 2]
    assert majority_element_n3([1, 2, 3]) == []   # no element > n/3 = 1
    assert sorted(majority_element_n3([1, 1, 1])) == [1]

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## References

- Boyer, R. S., & Moore, J S. (1991). MJRTY: A fast majority vote algorithm. In *Automated Reasoning: Essays in Honor of Woody Bledsoe* (pp. 105-117). Kluwer Academic Publishers. (Original 1981 technical report, published formally in 1991.)
- Misra, J., & Gries, D. (1982). Finding repeated elements. *Science of Computer Programming*, 2(2), 143-152. Independently discovered the same idea and extended it to the n/k case.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). *Introduction to Algorithms* (4th ed.). MIT Press. Chapter on linear-time selection and order statistics.

## Related topics

- [Kadane's algorithm](../kadane/), another single-pass array algorithm with a similarly surprising $O(n)$ result
- [Quickselect](../quickselect/), finds the k-th smallest element in $O(n)$ average; complementary to majority vote for "find the dominant element" problems
- [Data structures](../../data-structures/), the array properties (random access, contiguous memory) that make single-pass algorithms like this possible
