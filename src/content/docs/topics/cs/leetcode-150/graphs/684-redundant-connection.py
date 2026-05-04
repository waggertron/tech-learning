def find_redundant_connection(edges):
    pass  # TODO: implement

def _run_tests():
    assert find_redundant_connection([[1, 2], [1, 3], [2, 3]]) == [2, 3]
    assert find_redundant_connection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]) == [1, 4]
    assert find_redundant_connection([[1, 2], [1, 2]]) == [1, 2]
    assert find_redundant_connection([[1, 2], [2, 3], [1, 3]]) == [1, 3]
    assert find_redundant_connection([[1, 2], [2, 3], [3, 4], [4, 5], [3, 5]]) == [3, 5]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_edges = [[i, i + 1] for i in range(1, 200)] + [[1, 200]]
    find_redundant_connection(big_edges)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf redundant-connection 200 nodes cycle: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
