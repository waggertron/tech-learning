def k_closest(points, k):
    pass  # TODO: implement

def _run_tests():
    result = k_closest([[1, 3], [-2, 2]], 1)
    assert result == [[-2, 2]], f'got {result}'
    result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
    assert sorted(result) == sorted([[3, 3], [-2, 4]]), f'got {result}'
    assert k_closest([[0, 0]], 1) == [[0, 0]]
    result = k_closest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2)
    assert len(result) == 2
    pts = [[1, 2], [3, 4], [0, 0]]
    result = k_closest(pts, 3)
    assert len(result) == 3

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_pts = [[i, i + 1] for i in range(10000)]
    k_closest(big_pts, 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf k_closest n=10000 k=500: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
