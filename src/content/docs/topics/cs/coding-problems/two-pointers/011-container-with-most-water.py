def max_area(height: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
    assert max_area([1, 1]) == 1
    assert max_area([1, 2, 1]) == 2
    assert max_area([4, 3, 2, 1, 4]) == 16
    assert max_area([1, 2, 4, 3]) == 4
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_area(list(range(10000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-element array: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
