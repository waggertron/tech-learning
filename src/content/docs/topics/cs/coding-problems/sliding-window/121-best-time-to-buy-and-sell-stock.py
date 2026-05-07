def max_profit(prices: list) -> int:
    pass  # TODO: implement

def _run_tests():
    assert max_profit([7, 1, 5, 3, 6, 4]) == 5
    assert max_profit([7, 6, 4, 3, 1]) == 0
    assert max_profit([1]) == 0
    assert max_profit([1, 2]) == 1
    assert max_profit([2, 4, 1]) == 2
    assert max_profit([3, 3, 3]) == 0
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_profit(list(range(10000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-element array: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
