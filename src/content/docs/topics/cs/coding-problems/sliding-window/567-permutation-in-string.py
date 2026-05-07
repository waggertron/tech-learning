def check_inclusion(s1: str, s2: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert check_inclusion('ab', 'eidbaooo') == True
    assert check_inclusion('ab', 'eidboaoo') == False
    assert check_inclusion('a', 'a') == True
    assert check_inclusion('a', 'b') == False
    assert check_inclusion('abc', 'ab') == False
    assert check_inclusion('aab', 'aabc') == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    check_inclusion('ab', 'abcd' * 2500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-char s2: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
