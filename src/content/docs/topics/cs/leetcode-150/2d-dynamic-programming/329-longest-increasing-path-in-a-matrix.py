def longest_increasing_path(matrix):
    pass  # TODO: implement

def _run_tests():
    assert longest_increasing_path([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) == 4
    assert longest_increasing_path([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) == 4
    assert longest_increasing_path([[1]]) == 1
    assert longest_increasing_path([[1, 1], [1, 1]]) == 1
    assert longest_increasing_path([[1, 2, 3, 4]]) == 4
    # --- large-input timing ---
    import time as _t
    _grid = [[i * 50 + j for j in range(50)] for i in range(50)]
    _t0 = _t.perf_counter()
    longest_increasing_path(_grid)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf longest_increasing_path(50x50 grid): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
