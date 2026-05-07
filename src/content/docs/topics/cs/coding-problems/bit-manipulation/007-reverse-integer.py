INT_MIN = -2 ** 31

INT_MAX = 2 ** 31 - 1

def reverse(x):
    pass  # TODO: implement

def _run_tests():
    assert reverse(123) == 321
    assert reverse(-123) == -321
    assert reverse(120) == 21
    assert reverse(0) == 0
    assert reverse(2 ** 31 - 1) == 0
    assert reverse(1534236469) == 0
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    for i in range(1000):
        reverse(1534236469 - i)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf reverse integer x1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
