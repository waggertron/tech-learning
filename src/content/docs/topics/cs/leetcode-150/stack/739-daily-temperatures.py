def daily_temperatures(temperatures: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
    assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]
    assert daily_temperatures([30, 60, 90]) == [1, 1, 0]
    assert daily_temperatures([90, 60, 30]) == [0, 0, 0]
    assert daily_temperatures([70]) == [0]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    daily_temperatures([i % 100 for i in range(5000)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-element temperatures: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
