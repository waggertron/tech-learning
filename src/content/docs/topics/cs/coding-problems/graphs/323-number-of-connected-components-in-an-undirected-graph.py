def count_components(n, edges):
    pass  # TODO: implement

def _run_tests():
    assert count_components(5, [[0, 1], [1, 2], [3, 4]]) == 2
    assert count_components(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) == 1
    assert count_components(4, []) == 4
    assert count_components(1, []) == 1
    assert count_components(3, [[0, 1], [1, 2], [0, 2]]) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    count_components(500, [[i, i + 1] for i in range(499)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf count-components 500 nodes chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
