def length_of_longest_substring(s: str) -> int:
    pass  # TODO: implement

def _run_tests():
    assert length_of_longest_substring('abcabcbb') == 3
    assert length_of_longest_substring('bbbbb') == 1
    assert length_of_longest_substring('pwwkew') == 3
    assert length_of_longest_substring('') == 0
    assert length_of_longest_substring('a') == 1
    assert length_of_longest_substring('abcdef') == 6
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    length_of_longest_substring('abcd' * 2500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-char string: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
