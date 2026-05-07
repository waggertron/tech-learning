def can_jump(nums):
    pass  # TODO: implement

def _run_tests():
    assert can_jump([2, 3, 1, 1, 4]) == True
    assert can_jump([3, 2, 1, 0, 4]) == False
    assert can_jump([0]) == True
    assert can_jump([1, 0]) == True
    assert can_jump([0, 1]) == False
    assert can_jump([2, 0, 0]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    can_jump([1] * 10000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf can_jump(n=10000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
