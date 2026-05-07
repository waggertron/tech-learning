def can_partition(nums):
    pass  # TODO: implement

def _run_tests():
    assert can_partition([1, 5, 11, 5]) == True
    assert can_partition([1, 2, 3, 5]) == False
    assert can_partition([1]) == False
    assert can_partition([2, 2]) == True
    assert can_partition([1, 2, 5]) == False
    assert can_partition([3, 3, 3, 4, 5]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    can_partition(list(range(1, 101)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf can_partition(1..100): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
