def find_duplicate(nums):
    pass  # TODO: implement

def _run_tests():
    assert find_duplicate([1, 3, 4, 2, 2]) == 2
    assert find_duplicate([3, 1, 3, 4, 2]) == 3
    assert find_duplicate([3, 3, 3, 3, 3]) == 3
    assert find_duplicate([1, 1]) == 1
    assert find_duplicate([2, 2, 2, 1]) == 2
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
