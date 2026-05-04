def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
    pass  # TODO: implement

def _run_tests():
    assert find_median_sorted_arrays([1, 3], [2]) == 2.0
    assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5
    assert find_median_sorted_arrays([0, 0], [0, 0]) == 0.0
    assert find_median_sorted_arrays([], [1]) == 1.0
    assert find_median_sorted_arrays([2], []) == 2.0
    assert find_median_sorted_arrays([1, 3], [2, 4]) == 2.5
    # --- large-input timing ---
    import time as _t
    _a = list(range(0, 200000, 2))
    _b = list(range(1, 200000, 2))
    _t0 = _t.perf_counter()
    find_median_sorted_arrays(_a, _b)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_median_sorted_arrays n=100000 each: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
