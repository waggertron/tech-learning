def longest_consecutive(nums: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert longest_consecutive([100, 4, 200, 1, 3, 2]) == 4
    assert longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) == 9
    assert longest_consecutive([]) == 0
    assert longest_consecutive([1]) == 1
    assert longest_consecutive([1, 2, 3, 4, 5]) == 5
    assert longest_consecutive([5, 4, 3, 2, 1]) == 5
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
