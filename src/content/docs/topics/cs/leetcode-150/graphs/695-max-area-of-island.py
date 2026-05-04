def max_area_of_island(grid):
    pass  # TODO: implement

def _run_tests():
    assert max_area_of_island([[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]]) == 6
    assert max_area_of_island([[0, 0, 0, 0, 0, 0, 0, 0]]) == 0
    assert max_area_of_island([[1]]) == 1
    assert max_area_of_island([[0]]) == 0
    assert max_area_of_island([[1, 0, 0, 1, 1], [1, 0, 0, 0, 1]]) == 3
    assert max_area_of_island([[1, 1], [1, 1]]) == 4
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [[1] * 50 for _ in range(50)]
    max_area_of_island(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max-area-of-island 50x50 all-land grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
