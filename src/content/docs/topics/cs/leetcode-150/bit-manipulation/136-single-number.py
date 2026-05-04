def single_number(nums):
    pass  # TODO: implement

def _run_tests():
    assert single_number([2, 2, 1]) == 1
    assert single_number([4, 1, 2, 1, 2]) == 4
    assert single_number([1]) == 1
    assert single_number([0, 0, 99]) == 99
    assert single_number([-1, -1, 42]) == 42
    assert single_number([2 ** 31 - 1]) == 2 ** 31 - 1
    # --- large-input timing ---
    import time as _t
    _nums = list(range(1000)) * 2 + [9999]
    _t0 = _t.perf_counter()
    single_number(_nums)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf single_number n=2001: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
