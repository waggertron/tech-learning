def rotate(matrix):
    pass  # TODO: implement

def _run_tests():
    m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    rotate(m)
    assert m == [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
    m2 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]
    rotate(m2)
    assert m2 == [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]
    m3 = [[1]]
    rotate(m3)
    assert m3 == [[1]]
    m4 = [[1, 2], [3, 4]]
    rotate(m4)
    assert m4 == [[3, 1], [4, 2]]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_m = [[i * 100 + j for j in range(100)] for i in range(100)]
    rotate(big_m)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf rotate 100x100 matrix: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
