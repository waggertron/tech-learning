def longest_palindrome(s):
    pass  # TODO: implement

def _run_tests():
    assert longest_palindrome('babad') in ('bab', 'aba')
    assert longest_palindrome('cbbd') == 'bb'
    assert longest_palindrome('a') == 'a'
    assert longest_palindrome('ac') in ('a', 'c')
    assert longest_palindrome('racecar') == 'racecar'
    assert longest_palindrome('abacaba') == 'abacaba'
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
