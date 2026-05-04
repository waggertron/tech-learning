def oranges_rotting(grid):
    pass  # TODO: implement

def _run_tests():
    assert oranges_rotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4
    assert oranges_rotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1
    assert oranges_rotting([[0, 2]]) == 0
    assert oranges_rotting([[1, 1], [1, 1]]) == -1
    assert oranges_rotting([[0]]) == 0
    assert oranges_rotting([[2, 1]]) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [[1] * 30 for _ in range(30)]
    big[0][0] = 2
    oranges_rotting(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf rotting-oranges 30x30 grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
