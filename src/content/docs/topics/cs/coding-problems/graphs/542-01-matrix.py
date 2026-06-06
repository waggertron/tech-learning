from collections import deque

def update_matrix(mat: list[list[int]]) -> list[list[int]]:
    pass  # TODO: implement

def _run_tests():
    assert update_matrix([[0,0,0],[0,1,0],[0,0,0]]) == [[0,0,0],[0,1,0],[0,0,0]]
    assert update_matrix([[0,0,0],[0,1,0],[1,1,1]]) == [[0,0,0],[0,1,0],[1,2,1]]
    assert update_matrix([[0,0],[0,0]]) == [[0,0],[0,0]]
    assert update_matrix([[0]]) == [[0]]
    assert update_matrix([[0,0,0],[0,0,0],[0,0,1]]) == [[0,0,0],[0,0,0],[0,0,1]]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    n = 50
    big = [[0 if (r == 0 or c == 0) else 1 for c in range(n)] for r in range(n)]
    update_matrix(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 01-matrix {n}x{n} grid: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
