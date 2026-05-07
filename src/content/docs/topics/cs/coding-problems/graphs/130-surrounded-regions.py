def solve(board):
    pass  # TODO: implement

def _run_tests():
    b = [['X', 'X', 'X', 'X'], ['X', 'O', 'O', 'X'], ['X', 'X', 'O', 'X'], ['X', 'O', 'X', 'X']]
    solve(b)
    assert b == [['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'O', 'X', 'X']]
    b2 = [['X', 'X'], ['X', 'X']]
    solve(b2)
    assert b2 == [['X', 'X'], ['X', 'X']]
    b3 = [['O']]
    solve(b3)
    assert b3 == [['O']]
    b4 = [['O', 'O', 'O'], ['O', 'X', 'O'], ['O', 'O', 'O']]
    solve(b4)
    assert b4 == [['O', 'O', 'O'], ['O', 'X', 'O'], ['O', 'O', 'O']]
    b5 = [['X', 'X', 'X'], ['X', 'O', 'X'], ['X', 'X', 'X']]
    solve(b5)
    assert b5 == [['X', 'X', 'X'], ['X', 'X', 'X'], ['X', 'X', 'X']]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big = [['O' if (i == 0 or i == 49 or j == 0 or j == 49) else 'X' for j in range(50)] for i in range(50)]
    solve(big)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf surrounded-regions 50x50 board: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
