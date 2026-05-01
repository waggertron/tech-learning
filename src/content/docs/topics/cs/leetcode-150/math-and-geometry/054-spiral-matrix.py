def spiral_order(matrix):
    pass  # TODO: implement

def _run_tests():
    assert spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5]
    assert spiral_order([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
    assert spiral_order([[1]]) == [1]
    assert spiral_order([[1, 2], [3, 4]]) == [1, 2, 4, 3]
    assert spiral_order([[1], [2], [3]]) == [1, 2, 3]
    assert spiral_order([[1, 2, 3]]) == [1, 2, 3]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
