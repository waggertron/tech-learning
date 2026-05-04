def my_pow(x, n):
    pass  # TODO: implement

def _run_tests():
    assert abs(my_pow(2.0, 10) - 1024.0) < 1e-09
    assert abs(my_pow(2.0, -2) - 0.25) < 1e-09
    assert abs(my_pow(2.0, 0) - 1.0) < 1e-09
    assert abs(my_pow(1.0, 1000000) - 1.0) < 1e-09
    assert abs(my_pow(0.0, 5) - 0.0) < 1e-09
    assert abs(my_pow(2.0, 1) - 2.0) < 1e-09

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    my_pow(1.0000001, 1000000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf my_pow x=1.0000001 n=1000000: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
