from collections import deque

def oranges_rotting(grid):
    pass  # TODO: implement

def _run_tests():
    assert oranges_rotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4
    assert oranges_rotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1
    assert oranges_rotting([[0, 2]]) == 0
    assert oranges_rotting([[1, 1], [1, 1]]) == -1
    assert oranges_rotting([[0]]) == 0
    assert oranges_rotting([[2, 1]]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
