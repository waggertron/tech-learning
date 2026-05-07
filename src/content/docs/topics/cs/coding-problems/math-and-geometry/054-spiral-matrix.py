def spiral_order(matrix):
    pass  # TODO: implement

def _run_tests():
    assert spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5]
    assert spiral_order([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
    assert spiral_order([[1]]) == [1]
    assert spiral_order([[1, 2], [3, 4]]) == [1, 2, 4, 3]
    assert spiral_order([[1], [2], [3]]) == [1, 2, 3]
    assert spiral_order([[1, 2, 3]]) == [1, 2, 3]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_m = [[i * 100 + j for j in range(100)] for i in range(100)]
    spiral_order(big_m)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf spiral_order 100x100 matrix: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
