def num_islands(grid):
    pass  # TODO: implement

def _run_tests():
    g1 = [['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]
    assert num_islands(g1) == 1
    g2 = [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]
    assert num_islands(g2) == 3
    assert num_islands([]) == 0
    assert num_islands([['1']]) == 1
    assert num_islands([['0']]) == 0
    g3 = [['1', '1'], ['1', '1']]
    assert num_islands(g3) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
