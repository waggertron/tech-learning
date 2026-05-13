def is_palindrome(s: str) -> bool:
    cleaned = [ch.lower() for ch in s if ch.isalnum()]  # L1: O(n) filter
    l, r = 0, len(cleaned) - 1                          # L2: O(1) init pointers
    while l < r:                                         # L3: at most n/2 iterations
        if cleaned[l] != cleaned[r]:                     # L4: O(1) compare
            return False                                 # L5: O(1) early exit
        l, r = l + 1, r - 1                             # L6: O(1) advance both
    return True

assert is_palindrome('A man, a plan, a canal: Panama') == True
assert is_palindrome('race a car') == False
assert is_palindrome(' ') == True
assert is_palindrome('') == True
assert is_palindrome('a') == True
assert is_palindrome('aa') == True
assert is_palindrome('ab') == False
print('all tests pass')
