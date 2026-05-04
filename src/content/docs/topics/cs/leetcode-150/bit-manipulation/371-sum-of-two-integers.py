def get_sum(a, b):
    pass  # TODO: implement

def _run_tests():
    assert get_sum(1, 2) == 3
    assert get_sum(2, 3) == 5
    assert get_sum(0, 0) == 0
    assert get_sum(-1, 1) == 0
    assert get_sum(-5, 3) == -2
    assert get_sum(2 ** 30, 2 ** 30) == 2 ** 31
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    for i in range(1000):
        get_sum(i, i + 1)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf get_sum x1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
