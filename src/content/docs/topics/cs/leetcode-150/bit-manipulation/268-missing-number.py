def missing_number(nums):
    pass  # TODO: implement

def _run_tests():
    assert missing_number([3, 0, 1]) == 2
    assert missing_number([0, 1]) == 2
    assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
    assert missing_number([0]) == 1
    assert missing_number([1]) == 0
    assert missing_number([0, 1, 2, 4, 5]) == 3
    # --- large-input timing ---
    import time as _t
    _nums = list(range(1000))
    _t0 = _t.perf_counter()
    for i in range(1000):
        missing_number(_nums)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf missing_number n=1000 x1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
