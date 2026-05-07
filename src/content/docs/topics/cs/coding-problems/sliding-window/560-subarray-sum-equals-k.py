def subarray_sum(nums: list[int], k: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert subarray_sum([1,1,1], 2) == 2
    assert subarray_sum([1,2,3], 3) == 2
    assert subarray_sum([1], 0) == 0
    assert subarray_sum([1], 1) == 1
    assert subarray_sum([-1,-1,1], 0) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    subarray_sum(list(range(10000)), 100)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf subarray_sum n=10000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
