def find_target_sum_ways(nums, target):
    pass  # TODO: implement

def _run_tests():
    assert find_target_sum_ways([1, 1, 1, 1, 1], 3) == 5
    assert find_target_sum_ways([1], 1) == 1
    assert find_target_sum_ways([1, 1], 0) == 2
    assert find_target_sum_ways([1, 2], 4) == 0
    assert find_target_sum_ways([1], -1) == 1
    assert find_target_sum_ways([0, 0, 0], 0) == 8
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    find_target_sum_ways([1] * 20, 0)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_target_sum_ways([1]*20, 0): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
