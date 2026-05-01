def find_min(nums: list) -> int:
    pass  # TODO: implement

def _run_tests():
    assert find_min([3, 4, 5, 1, 2]) == 1
    assert find_min([4, 5, 6, 7, 0, 1, 2]) == 0
    assert find_min([11, 13, 15, 17]) == 11
    assert find_min([1]) == 1
    assert find_min([2, 1]) == 1
    assert find_min([1, 2]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
