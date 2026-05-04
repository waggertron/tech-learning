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
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    is_palindrome('a' * 5000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-char palindrome string: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
