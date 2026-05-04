def min_interval(intervals, queries):
    pass  # TODO: implement

def _run_tests():
    assert min_interval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]) == [3, 3, 1, 4]
    assert min_interval([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]) == [2, -1, 4, 6]
    assert min_interval([[1, 3]], [5]) == [-1]
    assert min_interval([[1, 10]], [5]) == [10]
    assert min_interval([[1, 5], [2, 3]], [2, 3]) == [2, 2]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_intervals = [[2 * i, 2 * i + 1] for i in range(1000)]
    big_queries = [2 * i for i in range(1000)]
    min_interval(big_intervals, big_queries)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min_interval 1000 intervals 1000 queries: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
