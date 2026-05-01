import heapq

def min_interval(intervals, queries):
    pass  # TODO: implement

def _run_tests():
    assert min_interval([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]) == [3, 3, 1, 4]
    assert min_interval([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]) == [2, -1, 4, 6]
    assert min_interval([[1, 3]], [5]) == [-1]
    assert min_interval([[1, 10]], [5]) == [10]
    assert min_interval([[1, 5], [2, 3]], [2, 3]) == [2, 2]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
