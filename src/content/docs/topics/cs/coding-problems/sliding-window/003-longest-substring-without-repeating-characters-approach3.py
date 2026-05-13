def length_of_longest_substring(s: str) -> int:
    last_seen = {}                                        # L1: O(1)
    left = 0                                             # L2: O(1)
    best = 0                                             # L3: O(1)
    for right, ch in enumerate(s):                       # L4: outer loop, n iterations
        if ch in last_seen and last_seen[ch] >= left:    # L5: O(1) hash lookup
            left = last_seen[ch] + 1                     # L6: O(1) jump left
        last_seen[ch] = right                            # L7: O(1) update map
        best = max(best, right - left + 1)               # L8: O(1)
    return best

assert length_of_longest_substring("abcabcbb") == 3
assert length_of_longest_substring("bbbbb") == 1
assert length_of_longest_substring("pwwkew") == 3
assert length_of_longest_substring("") == 0
assert length_of_longest_substring("a") == 1
assert length_of_longest_substring("abcdef") == 6
print("all tests pass")
