def erase_overlap_intervals(intervals):
    pass  # TODO: implement

def _run_tests():
    assert erase_overlap_intervals([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1
    assert erase_overlap_intervals([[1, 2], [1, 2], [1, 2]]) == 2
    assert erase_overlap_intervals([[1, 2], [2, 3]]) == 0
    assert erase_overlap_intervals([[1, 5]]) == 0
    assert erase_overlap_intervals([]) == 0
    assert erase_overlap_intervals([[1, 100], [2, 3], [4, 5], [6, 7]]) == 1

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    erase_overlap_intervals([[2 * i, 2 * i + 1] for i in range(1000)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf erase_overlap_intervals 1000 non-overlapping intervals: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
