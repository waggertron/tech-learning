def search_matrix(matrix: list, target: int) -> bool:
    pass  # TODO: implement

def _run_tests():
    m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
    assert search_matrix(m, 3) == True
    assert search_matrix(m, 13) == False
    assert search_matrix([[1]], 1) == True
    assert search_matrix([[1]], 2) == False
    assert search_matrix([[1, 3]], 3) == True
    assert search_matrix([[1], [3]], 1) == True
    # --- large-input timing ---
    import time as _t
    _rows = 1000
    _cols = 100
    _mat = [[r * _cols + c for c in range(_cols)] for r in range(_rows)]
    _t0 = _t.perf_counter()
    search_matrix(_mat, _rows * _cols - 1)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf search_matrix 1000x100: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
