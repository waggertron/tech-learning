def max_profit(prices):
    pass  # TODO: implement

def _run_tests():
    assert max_profit([1, 2, 3, 0, 2]) == 3
    assert max_profit([1]) == 0
    assert max_profit([]) == 0
    assert max_profit([5, 4, 3, 2, 1]) == 0
    assert max_profit([1, 2, 3, 4, 5]) == 4
    assert max_profit([1, 2]) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    max_profit(list(range(500, 0, -1)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf max_profit(range 500 desc): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
