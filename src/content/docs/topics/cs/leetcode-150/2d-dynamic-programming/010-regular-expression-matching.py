def is_match(s, p):
    pass  # TODO: implement

def _run_tests():
    assert is_match('aa', 'a') == False
    assert is_match('aa', 'a*') == True
    assert is_match('ab', '.*') == True
    assert is_match('mississippi', 'mis*is*p*.') == False
    assert is_match('', '') == True
    assert is_match('', 'a*') == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    is_match('a' * 200, 'a' * 100 + '.*')
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_match("a"*200, pattern): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
