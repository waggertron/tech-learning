def insert(intervals, new_interval):
    pass  # TODO: implement

def _run_tests():
    assert insert([[1, 3], [6, 9]], [2, 5]) == [[1, 5], [6, 9]]
    assert insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]) == [[1, 2], [3, 10], [12, 16]]
    assert insert([[3, 5], [6, 9]], [1, 2]) == [[1, 2], [3, 5], [6, 9]]
    assert insert([[1, 2], [3, 5]], [7, 9]) == [[1, 2], [3, 5], [7, 9]]
    assert insert([[1, 2], [3, 4], [5, 6]], [0, 10]) == [[0, 10]]
    assert insert([], [1, 5]) == [[1, 5]]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    insert([[2 * i, 2 * i + 1] for i in range(1000)], [999, 1000])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf insert 1000 intervals: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
