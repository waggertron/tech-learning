def insert(intervals, new_interval):
    pass  # TODO: implement

def _run_tests():
    assert insert([[1, 3], [6, 9]], [2, 5]) == [[1, 5], [6, 9]]
    assert insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]) == [[1, 2], [3, 10], [12, 16]]
    assert insert([[3, 5], [6, 9]], [1, 2]) == [[1, 2], [3, 5], [6, 9]]
    assert insert([[1, 2], [3, 5]], [7, 9]) == [[1, 2], [3, 5], [7, 9]]
    assert insert([[1, 2], [3, 4], [5, 6]], [0, 10]) == [[0, 10]]
    assert insert([], [1, 5]) == [[1, 5]]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
