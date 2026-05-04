def max_subarray(nums):
    pass  # TODO: implement

def _run_tests():
    assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert max_subarray([1]) == 1
    assert max_subarray([5, 4, -1, 7, 8]) == 23
    assert max_subarray([-1]) == -1
    assert max_subarray([-2, -3, -1, -5]) == -1
    assert max_subarray([1, 2, 3, 4, 5]) == 15
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_subarray(list(range(-5000, 5000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max_subarray(n=10000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
