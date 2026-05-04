def search(nums: list, target: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert search([-1, 0, 3, 5, 9, 12], 9) == 4
    assert search([-1, 0, 3, 5, 9, 12], 2) == -1
    assert search([5], 5) == 0
    assert search([5], 3) == -1
    assert search([-1, 0, 3, 5, 9, 12], -1) == 0
    assert search([-1, 0, 3, 5, 9, 12], 12) == 5
    # --- large-input timing ---
    import time as _t
    _arr = list(range(100000))
    _t0 = _t.perf_counter()
    search(_arr, 99999)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf binary search n=100000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
