def swim_in_water(grid):
    pass  # TODO: implement

def _run_tests():
    assert swim_in_water([[0, 2], [1, 3]]) == 3
    assert swim_in_water([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]) == 16
    assert swim_in_water([[0]]) == 0
    assert swim_in_water([[7]]) == 7
    assert swim_in_water([[0, 1], [3, 2]]) == 2
    # --- large-input timing ---
    import time as _t
    import random as _r
    _r.seed(42)
    n = 30
    vals = list(range(n * n))
    _r.shuffle(vals)
    big = [vals[i * n:(i + 1) * n] for i in range(n)]
    _t0 = _t.perf_counter()
    swim_in_water(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf swim-in-rising-water 30x30 grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
