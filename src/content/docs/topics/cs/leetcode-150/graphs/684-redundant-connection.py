def find_redundant_connection(edges):
    pass  # TODO: implement

def _run_tests():
    assert find_redundant_connection([[1, 2], [1, 3], [2, 3]]) == [2, 3]
    assert find_redundant_connection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]) == [1, 4]
    assert find_redundant_connection([[1, 2], [1, 2]]) == [1, 2]
    assert find_redundant_connection([[1, 2], [2, 3], [1, 3]]) == [1, 3]
    assert find_redundant_connection([[1, 2], [2, 3], [3, 4], [4, 5], [3, 5]]) == [3, 5]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
