def valid_tree(n, edges):
    pass  # TODO: implement

def _run_tests():
    assert valid_tree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]) == True
    assert valid_tree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]) == False
    assert valid_tree(1, []) == True
    assert valid_tree(2, [[0, 1]]) == True
    assert valid_tree(2, []) == False
    assert valid_tree(3, [[0, 1], [1, 2], [0, 2]]) == False
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    valid_tree(500, [[i, i + 1] for i in range(499)])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf valid-tree 500 nodes chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
