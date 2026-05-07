def max_coins(nums):
    pass  # TODO: implement

def _run_tests():
    assert max_coins([3, 1, 5, 8]) == 167
    assert max_coins([1, 5]) == 10
    assert max_coins([5]) == 5
    assert max_coins([3, 3]) == 12
    assert max_coins([1, 1, 1]) == 3
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_coins(list(range(1, 31)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max_coins(range 1..30): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
