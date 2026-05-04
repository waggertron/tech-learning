def max_product(nums):
    pass  # TODO: implement

def _run_tests():
    assert max_product([2, 3, -2, 4]) == 6
    assert max_product([-2, 0, -1]) == 0
    assert max_product([-2, 3, -4]) == 24
    assert max_product([0]) == 0
    assert max_product([-3]) == -3
    assert max_product([-2, -3]) == 6
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_product(list(range(500, 0, -1)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max_product(range 500 desc): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
