def is_palindrome(s: str) -> bool:
    l, r = 0, len(s) - 1                # L1: O(1) init pointers
    while l < r:                         # L2: at most n steps total
        while l < r and not s[l].isalnum():  # L3: skip non-alnum on left
            l += 1                       # L4: O(1)
        while l < r and not s[r].isalnum():  # L5: skip non-alnum on right
            r -= 1                       # L6: O(1)
        if s[l].lower() != s[r].lower():  # L7: O(1) compare
            return False                  # L8: O(1) early exit
        l, r = l + 1, r - 1             # L9: O(1) advance both
    return True

assert is_palindrome('A man, a plan, a canal: Panama') == True
assert is_palindrome('race a car') == False
assert is_palindrome(' ') == True
assert is_palindrome('') == True
assert is_palindrome('a') == True
assert is_palindrome('aa') == True
assert is_palindrome('ab') == False
print('all tests pass')
