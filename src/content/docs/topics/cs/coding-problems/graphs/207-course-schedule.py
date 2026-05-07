def can_finish(num_courses, prerequisites):
    pass  # TODO: implement

def _run_tests():
    assert can_finish(2, [[1, 0]]) == True
    assert can_finish(2, [[1, 0], [0, 1]]) == False
    assert can_finish(5, []) == True
    assert can_finish(1, []) == True
    assert can_finish(3, [[1, 0], [2, 1], [0, 2]]) == False
    assert can_finish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    can_finish(200, [[i + 1, i] for i in range(199)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf can-finish 200 courses DAG chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
