def find_circle_num(isConnected: list[list[int]]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert find_circle_num([[1,1,0],[1,1,0],[0,0,1]]) == 2
    assert find_circle_num([[1,0,0],[0,1,0],[0,0,1]]) == 3
    assert find_circle_num([[1,1,1],[1,1,1],[1,1,1]]) == 1
    assert find_circle_num([[1]]) == 1
    assert find_circle_num([[1,1,0],[1,1,1],[0,1,1]]) == 1
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    n = 100
    big = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    find_circle_num(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf number-of-provinces {n} isolated cities: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
