def find_min(nums: list) -> int:
    pass  # TODO: implement

def _run_tests():
    assert find_min([3, 4, 5, 1, 2]) == 1
    assert find_min([4, 5, 6, 7, 0, 1, 2]) == 0
    assert find_min([11, 13, 15, 17]) == 11
    assert find_min([1]) == 1
    assert find_min([2, 1]) == 1
    assert find_min([1, 2]) == 1
    # --- large-input timing ---
    import time as _t
    _arr = list(range(50000, 100000)) + list(range(0, 50000))
    _t0 = _t.perf_counter()
    find_min(_arr)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_min rotated n=100000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
