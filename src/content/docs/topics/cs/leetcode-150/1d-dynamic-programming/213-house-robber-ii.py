def rob(nums):
    pass  # TODO: implement

def _run_tests():
    assert rob([2, 3, 2]) == 3
    assert rob([1, 2, 3, 1]) == 4
    assert rob([1, 2, 3]) == 3
    assert rob([5]) == 5
    assert rob([1, 3]) == 3
    assert rob([2, 7, 9, 3, 1]) == 11
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    rob(list(range(500, 0, -1)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf rob_ii(range 500 desc): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
