def least_interval(tasks, n):
    pass  # TODO: implement

def _run_tests():
    assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 2) == 8
    assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 0) == 6
    assert least_interval(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2) == 16
    assert least_interval(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 2) == 8
    assert least_interval(['A', 'A', 'A'], 3) == 9
    assert least_interval(['A', 'A', 'A'], 0) == 3

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    tasks_big = [chr(65 + i % 26) for i in range(10000)]
    least_interval(tasks_big, 2)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf least_interval n=10000: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
