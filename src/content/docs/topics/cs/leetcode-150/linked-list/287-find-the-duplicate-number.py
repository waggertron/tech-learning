def find_duplicate(nums):
    pass  # TODO: implement

def _run_tests():
    assert find_duplicate([1, 3, 4, 2, 2]) == 2
    assert find_duplicate([3, 1, 3, 4, 2]) == 3
    assert find_duplicate([3, 3, 3, 3, 3]) == 3
    assert find_duplicate([1, 1]) == 1
    assert find_duplicate([2, 2, 2, 1]) == 2
    # --- large-input timing ---
    import time as _t
    _nums = list(range(1, 1001)) + [500]
    _t0 = _t.perf_counter()
    find_duplicate(_nums)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_duplicate(1001-element array): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
