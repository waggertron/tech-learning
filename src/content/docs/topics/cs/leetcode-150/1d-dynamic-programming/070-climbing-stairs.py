def climb_stairs(n):
    pass  # TODO: implement

def _run_tests():
    assert climb_stairs(1) == 1
    assert climb_stairs(2) == 2
    assert climb_stairs(3) == 3
    assert climb_stairs(4) == 5
    assert climb_stairs(5) == 8
    assert climb_stairs(10) == 89
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    climb_stairs(500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf climb_stairs(500): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
