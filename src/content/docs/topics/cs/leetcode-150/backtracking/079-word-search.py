def exist(board, word):
    pass  # TODO: implement

def _run_tests():
    board = [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']]
    import copy
    assert exist(copy.deepcopy(board), 'ABCCED') == True
    assert exist(copy.deepcopy(board), 'SEE') == True
    assert exist(copy.deepcopy(board), 'ABCB') == False
    assert exist([['A']], 'A') == True
    assert exist([['A']], 'B') == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
