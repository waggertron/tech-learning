def coin_change(coins, amount):
    pass  # TODO: implement

def _run_tests():
    assert coin_change([1, 2, 5], 11) == 3
    assert coin_change([2], 3) == -1
    assert coin_change([1], 0) == 0
    assert coin_change([1], 1) == 1
    assert coin_change([2, 5, 10, 1], 27) == 4
    assert coin_change([186, 419, 83, 408], 6249) == 20
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    coin_change([1, 2, 5], 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf coin_change([1,2,5], 500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
