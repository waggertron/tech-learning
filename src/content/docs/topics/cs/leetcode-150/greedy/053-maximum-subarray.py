def max_subarray(nums):
    pass  # TODO: implement

def _run_tests():
    assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert max_subarray([1]) == 1
    assert max_subarray([5, 4, -1, 7, 8]) == 23
    assert max_subarray([-1]) == -1
    assert max_subarray([-2, -3, -1, -5]) == -1
    assert max_subarray([1, 2, 3, 4, 5]) == 15
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
