from collections import deque

def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert shortest_path_binary_matrix([[0,1],[1,0]]) == 2
    assert shortest_path_binary_matrix([[0,0,0],[1,1,0],[1,1,0]]) == 4
    assert shortest_path_binary_matrix([[1,0,0],[1,1,0],[1,1,0]]) == -1
    assert shortest_path_binary_matrix([[0,0,0],[0,0,0],[0,0,1]]) == -1
    assert shortest_path_binary_matrix([[0]]) == 1
    assert shortest_path_binary_matrix([[1]]) == -1
    assert shortest_path_binary_matrix([[0,0],[0,0]]) == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    n = 50
    big = [[0] * n for _ in range(n)]
    shortest_path_binary_matrix(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf shortest-path-binary-matrix {n}x{n} all-clear grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
