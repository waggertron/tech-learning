def search(nums: list, target: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert search([4, 5, 6, 7, 0, 1, 2], 0) == 4
    assert search([4, 5, 6, 7, 0, 1, 2], 3) == -1
    assert search([1], 0) == -1
    assert search([1], 1) == 0
    assert search([3, 1], 1) == 1
    assert search([3, 1], 3) == 0
    # --- large-input timing ---
    import time as _t
    _arr = list(range(50000, 100000)) + list(range(0, 50000))
    _t0 = _t.perf_counter()
    search(_arr, 99999)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf search rotated n=100000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
