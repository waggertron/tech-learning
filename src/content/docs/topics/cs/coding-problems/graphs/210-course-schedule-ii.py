def find_order(num_courses, prerequisites):
    pass  # TODO: implement

def _run_tests():
    assert find_order(2, [[1, 0]]) == [0, 1]
    result = find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])
    assert result.index(0) < result.index(1)
    assert result.index(0) < result.index(2)
    assert result.index(1) < result.index(3)
    assert result.index(2) < result.index(3)
    assert find_order(2, [[1, 0], [0, 1]]) == []
    assert find_order(1, []) == [0]
    result = find_order(3, [])
    assert set(result) == {0, 1, 2}
    assert find_order(3, [[0, 1], [1, 2], [2, 0]]) == []
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    find_order(200, [[i + 1, i] for i in range(199)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find-order 200 courses DAG chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
