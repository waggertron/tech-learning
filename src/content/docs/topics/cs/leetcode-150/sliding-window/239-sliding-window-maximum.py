from collections import deque

def max_sliding_window(nums: list, k: int) -> list:
    pass  # TODO: implement

def _run_tests():
    assert max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7]
    assert max_sliding_window([1], 1) == [1]
    assert max_sliding_window([1, -1], 1) == [1, -1]
    assert max_sliding_window([9, 8, 7, 6, 5], 3) == [9, 8, 7]
    assert max_sliding_window([1, 2, 3, 4, 5], 3) == [3, 4, 5]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
