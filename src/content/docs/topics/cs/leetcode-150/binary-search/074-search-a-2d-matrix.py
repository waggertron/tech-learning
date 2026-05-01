def search_matrix(matrix: list, target: int) -> bool:
    pass  # TODO: implement

def _run_tests():
    m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
    assert search_matrix(m, 3) == True
    assert search_matrix(m, 13) == False
    assert search_matrix([[1]], 1) == True
    assert search_matrix([[1]], 2) == False
    assert search_matrix([[1, 3]], 3) == True
    assert search_matrix([[1], [3]], 1) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
