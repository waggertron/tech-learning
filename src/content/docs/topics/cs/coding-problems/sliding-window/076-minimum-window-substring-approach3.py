from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)                                      # L1: O(|t|)
    needed = len(need)                                     # L2: O(1)
    window = Counter()                                     # L3: O(1)
    have = 0                                               # L4: O(1)
    left = 0
    best = (float('inf'), 0, 0)                            # L5: O(1)

    for right, ch in enumerate(s):                         # L6: outer loop, n iterations
        window[ch] += 1                                    # L7: O(1)
        if ch in need and window[ch] == need[ch]:          # L8: O(1) comparison
            have += 1                                      # L9: O(1)
        while have == needed:                              # L10: O(1) guard; shrink loop
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)    # L11: O(1) tuple
            window[s[left]] -= 1                           # L12: O(1)
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1                                  # L13: O(1)
            left += 1                                      # L14: O(1)

    return "" if best[0] == float('inf') else s[best[1]:best[2] + 1]

assert min_window("ADOBECODEBANC", "ABC") == "BANC"
assert min_window("a", "a") == "a"
assert min_window("a", "aa") == ""
assert min_window("", "a") == ""
assert min_window("abc", "") == ""
assert min_window("aa", "aa") == "aa"
print("all tests pass")
