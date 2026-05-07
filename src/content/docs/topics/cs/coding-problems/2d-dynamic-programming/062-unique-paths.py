def unique_paths(m, n):
    pass  # TODO: implement

def _run_tests():
    assert unique_paths(3, 7) == 28
    assert unique_paths(3, 2) == 3
    assert unique_paths(1, 1) == 1
    assert unique_paths(1, 5) == 1
    assert unique_paths(5, 1) == 1
    assert unique_paths(3, 3) == 6
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    unique_paths(100, 100)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf unique_paths(100, 100): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
