def swim_in_water(grid):
    pass  # TODO: implement

def _run_tests():
    assert swim_in_water([[0, 2], [1, 3]]) == 3
    assert swim_in_water([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]) == 16
    assert swim_in_water([[0]]) == 0
    assert swim_in_water([[7]]) == 7
    assert swim_in_water([[0, 1], [3, 2]]) == 2
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
