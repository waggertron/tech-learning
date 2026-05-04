def solve_n_queens(n):
    pass  # TODO: implement

def _run_tests():
    assert solve_n_queens(1) == [['Q']]
    r4 = solve_n_queens(4)
    assert len(r4) == 2
    assert sorted(r4) == sorted([['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']])
    assert len(solve_n_queens(5)) == 10
    assert solve_n_queens(2) == []
    assert solve_n_queens(3) == []
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    solve_n_queens(8)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf solve_n_queens(n=8): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
