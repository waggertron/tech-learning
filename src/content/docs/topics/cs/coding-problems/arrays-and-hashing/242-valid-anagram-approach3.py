def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for ch in s:
        counts[ord(ch) - ord('a')] += 1
    for ch in t:
        idx = ord(ch) - ord('a')
        counts[idx] -= 1
        if counts[idx] < 0:
            return False
    return True

assert is_anagram('anagram', 'nagaram') == True
assert is_anagram('rat', 'car') == False
assert is_anagram('a', 'a') == True
assert is_anagram('ab', 'ba') == True
assert is_anagram('ab', 'a') == False
assert is_anagram('', '') == True
print("all tests pass")
