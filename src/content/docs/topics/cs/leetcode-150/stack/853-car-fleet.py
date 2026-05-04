def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) == 3
    assert car_fleet(10, [3], [3]) == 1
    assert car_fleet(100, [0, 2, 4], [4, 2, 1]) == 1
    assert car_fleet(10, [6, 8], [3, 2]) == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    car_fleet(5001, list(range(5000)), [1] * 5000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-car fleet: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
