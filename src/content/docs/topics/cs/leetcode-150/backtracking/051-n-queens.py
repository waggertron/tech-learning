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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
