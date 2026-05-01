def merge(intervals):
    pass  # TODO: implement

def _run_tests():
    assert merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
    assert merge([[1, 4], [4, 5]]) == [[1, 5]]
    assert merge([[1, 2]]) == [[1, 2]]
    assert merge([[1, 10], [2, 5], [3, 8]]) == [[1, 10]]
    assert merge([[1, 2], [3, 4], [5, 6]]) == [[1, 2], [3, 4], [5, 6]]
    assert merge([[15, 18], [1, 3], [2, 6], [8, 10]]) == [[1, 6], [8, 10], [15, 18]]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
