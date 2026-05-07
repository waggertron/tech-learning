def is_happy(n):
    pass  # TODO: implement

def _run_tests():
    assert is_happy(19) == True
    assert is_happy(2) == False
    assert is_happy(1) == True
    assert is_happy(7) == True
    assert is_happy(4) == False
    assert is_happy(100) == True

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    for n in range(1, 1001):
        is_happy(n)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_happy n=1..1000: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
