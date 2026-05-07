def four_sum_count(nums1: list[int], nums2: list[int], nums3: list[int], nums4: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert four_sum_count([1,2], [-2,-1], [-1,2], [0,2]) == 2
    assert four_sum_count([0], [0], [0], [0]) == 1
    assert four_sum_count([-1,-1], [-1,1], [-1,1], [1,-1]) == 6
    # --- large-input timing ---
    import time as _t
    n = 100
    _t0 = _t.perf_counter()
    four_sum_count(list(range(n)), list(range(n)), list(range(n)), list(range(n)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf four_sum_count n={n}: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
