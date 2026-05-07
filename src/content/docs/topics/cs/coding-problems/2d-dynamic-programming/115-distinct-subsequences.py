def num_distinct(s, t):
    pass  # TODO: implement

def _run_tests():
    assert num_distinct('rabbbit', 'rabbit') == 3
    assert num_distinct('babgbag', 'bag') == 5
    assert num_distinct('abc', '') == 1
    assert num_distinct('', 'a') == 0
    assert num_distinct('abc', 'abc') == 1
    assert num_distinct('aaa', 'b') == 0
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    num_distinct('a' * 200, 'a' * 100)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf num_distinct("a"*200, "a"*100): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
