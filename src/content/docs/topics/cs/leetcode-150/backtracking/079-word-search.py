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
    # --- large-input timing ---
    import time as _t
    _board = [['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
              ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
              ['U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D'],
              ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
              ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
              ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
              ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
              ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B'],
              ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
              ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']]
    _t0 = _t.perf_counter()
    exist(_board, 'ABCD')
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf exist(10x10 grid, word="ABCD"): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
