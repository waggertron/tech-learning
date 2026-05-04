def pacific_atlantic(heights):
    pass  # TODO: implement

def _run_tests():
    h1 = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]
    assert pacific_atlantic(h1) == [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
    assert pacific_atlantic([[5]]) == [[0, 0]]
    h2 = [[1, 1], [1, 1]]
    result2 = pacific_atlantic(h2)
    assert sorted(result2) == [[0, 0], [0, 1], [1, 0], [1, 1]]
    h3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    r3 = pacific_atlantic(h3)
    assert [2, 2] in r3
    assert pacific_atlantic([]) == []
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [[i + j for j in range(30)] for i in range(30)]
    pacific_atlantic(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf pacific-atlantic 30x30 grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
