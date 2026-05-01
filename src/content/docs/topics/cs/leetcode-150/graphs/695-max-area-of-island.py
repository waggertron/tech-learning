def max_area_of_island(grid):
    pass  # TODO: implement

def _run_tests():
    assert max_area_of_island([[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]]) == 6
    assert max_area_of_island([[0, 0, 0, 0, 0, 0, 0, 0]]) == 0
    assert max_area_of_island([[1]]) == 1
    assert max_area_of_island([[0]]) == 0
    assert max_area_of_island([[1, 0, 0, 1, 1], [1, 0, 0, 0, 1]]) == 3
    assert max_area_of_island([[1, 1], [1, 1]]) == 4
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
