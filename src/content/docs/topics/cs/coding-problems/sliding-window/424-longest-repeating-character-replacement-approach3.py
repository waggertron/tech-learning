from collections import Counter

def character_replacement(s: str, k: int) -> int:
    counts = Counter()
    left = 0
    max_freq = 0
    best = 0
    for right, ch in enumerate(s):                      # L1: outer loop, n iterations
        counts[ch] += 1                                  # L2: O(1)
        max_freq = max(max_freq, counts[ch])             # L3: O(1) running max
        while (right - left + 1) - max_freq > k:        # L4: shrink if too many replacements
            counts[s[left]] -= 1                        # L5: O(1)
            left += 1                                   # L6: O(1)
        best = max(best, right - left + 1)              # L7: O(1)
    return best

assert character_replacement("ABAB", 2) == 4
assert character_replacement("AABABBA", 1) == 4
assert character_replacement("A", 0) == 1
assert character_replacement("AAAA", 2) == 4
assert character_replacement("ABCDE", 1) == 2
assert character_replacement("AABBA", 2) == 5
print("all tests pass")
