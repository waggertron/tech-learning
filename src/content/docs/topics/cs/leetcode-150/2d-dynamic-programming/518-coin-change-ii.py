def change(amount, coins):
    pass  # TODO: implement

def _run_tests():
    assert change(5, [1, 2, 5]) == 4
    assert change(3, [2]) == 0
    assert change(0, [1, 2, 5]) == 1
    assert change(10, [5]) == 1
    assert change(10, [1, 5, 10]) == 4
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    change(500, [1, 2, 5, 10, 25, 50])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf change(500, [1,2,5,10,25,50]): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
