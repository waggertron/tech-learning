def set_zeroes(matrix):
    pass  # TODO: implement

def _run_tests():
    m = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
    set_zeroes(m)
    assert m == [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
    m2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]
    set_zeroes(m2)
    assert m2 == [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
    m3 = [[1]]
    set_zeroes(m3)
    assert m3 == [[1]]
    m4 = [[0]]
    set_zeroes(m4)
    assert m4 == [[0]]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_m = [[i * 100 + j for j in range(100)] for i in range(100)]
    big_m[50][50] = 0
    set_zeroes(big_m)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf set_zeroes 100x100 matrix: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
