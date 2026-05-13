from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    if n > m:
        return False
    target = Counter(s1)                    # L1: O(n)
    window = Counter(s2[:n])               # L2: O(n) initial window
    if window == target:                   # L3: O(k) compare
        return True
    for i in range(n, m):                  # L4: slide m - n steps
        window[s2[i]] += 1                 # L5: O(1) add new char
        window[s2[i - n]] -= 1            # L6: O(1) remove old char
        if window[s2[i - n]] == 0:
            del window[s2[i - n]]          # L7: O(1) cleanup
        if window == target:               # L8: O(k) compare
            return True
    return False

assert check_inclusion("ab", "eidbaooo") == True
assert check_inclusion("ab", "eidboaoo") == False
assert check_inclusion("a", "a") == True
assert check_inclusion("a", "b") == False
assert check_inclusion("abc", "ab") == False
assert check_inclusion("aab", "aabc") == True
print("all tests pass")
