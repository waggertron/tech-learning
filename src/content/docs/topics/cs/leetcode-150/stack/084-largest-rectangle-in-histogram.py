def largest_rectangle_area(heights: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10
    assert largest_rectangle_area([2, 4]) == 4
    assert largest_rectangle_area([1]) == 1
    assert largest_rectangle_area([6, 5, 4, 3, 2, 1]) == 12
    assert largest_rectangle_area([1, 2, 3, 4, 5, 6]) == 12
    assert largest_rectangle_area([2, 0, 2]) == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    largest_rectangle_area([i % 100 for i in range(5000)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-bar histogram: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
