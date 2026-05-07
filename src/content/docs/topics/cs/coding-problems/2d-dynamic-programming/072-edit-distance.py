def min_distance(word1, word2):
    pass  # TODO: implement

def _run_tests():
    assert min_distance('horse', 'ros') == 3
    assert min_distance('intention', 'execution') == 5
    assert min_distance('', '') == 0
    assert min_distance('abc', '') == 3
    assert min_distance('', 'abc') == 3
    assert min_distance('abc', 'abc') == 0
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    min_distance('a' * 200, 'b' * 200)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min_distance("a"*200, "b"*200): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
