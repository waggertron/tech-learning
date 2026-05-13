from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)

assert is_anagram('anagram', 'nagaram') == True
assert is_anagram('rat', 'car') == False
assert is_anagram('a', 'a') == True
assert is_anagram('ab', 'ba') == True
assert is_anagram('ab', 'a') == False
assert is_anagram('', '') == True
print("all tests pass")
