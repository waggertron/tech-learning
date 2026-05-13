def repeated_substring_pattern(s: str) -> bool:
    doubled = (s + s)[1:-1]
    return s in doubled

assert repeated_substring_pattern("abab") == True
assert repeated_substring_pattern("aba") == False
assert repeated_substring_pattern("abcabcabcabc") == True
assert repeated_substring_pattern("a") == False
assert repeated_substring_pattern("aa") == True
assert repeated_substring_pattern("abaaba") == True
print("all tests pass")
