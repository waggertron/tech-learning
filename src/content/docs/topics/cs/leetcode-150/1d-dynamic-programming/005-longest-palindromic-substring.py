def longest_palindrome(s):
    pass  # TODO: implement

def _run_tests():
    assert longest_palindrome('babad') in ('bab', 'aba')
    assert longest_palindrome('cbbd') == 'bb'
    assert longest_palindrome('a') == 'a'
    assert longest_palindrome('ac') in ('a', 'c')
    assert longest_palindrome('racecar') == 'racecar'
    assert longest_palindrome('abacaba') == 'abacaba'
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    longest_palindrome('a' * 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf longest_palindrome("a"*500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
