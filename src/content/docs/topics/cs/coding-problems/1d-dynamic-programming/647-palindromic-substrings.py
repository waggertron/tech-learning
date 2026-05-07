def count_substrings(s):
    pass  # TODO: implement

def _run_tests():
    assert count_substrings('abc') == 3
    assert count_substrings('aaa') == 6
    assert count_substrings('a') == 1
    assert count_substrings('aa') == 3
    assert count_substrings('abba') == 6
    assert count_substrings('racecar') == 10
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    count_substrings('a' * 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf count_substrings("a"*500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
