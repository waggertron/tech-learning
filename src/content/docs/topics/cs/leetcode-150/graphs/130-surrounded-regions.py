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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
