def min_eating_speed(piles: list, h: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert min_eating_speed([3, 6, 7, 11], 8) == 4
    assert min_eating_speed([30, 11, 23, 4, 20], 5) == 30
    assert min_eating_speed([30, 11, 23, 4, 20], 6) == 23
    assert min_eating_speed([1], 1) == 1
    assert min_eating_speed([1000000000], 2) == 500000000
    # --- large-input timing ---
    import time as _t
    _piles = list(range(1, 100001))
    _t0 = _t.perf_counter()
    min_eating_speed(_piles, 100000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min_eating_speed n=100000 piles: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
