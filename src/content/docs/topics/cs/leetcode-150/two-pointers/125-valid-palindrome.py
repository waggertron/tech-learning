def is_palindrome(s: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert is_palindrome('A man, a plan, a canal: Panama') == True
    assert is_palindrome('race a car') == False
    assert is_palindrome(' ') == True
    assert is_palindrome('') == True
    assert is_palindrome('a') == True
    assert is_palindrome('aa') == True
    assert is_palindrome('ab') == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
