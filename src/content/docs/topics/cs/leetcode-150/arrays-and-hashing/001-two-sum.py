def two_sum(nums: list[int], target: int) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    assert two_sum([3, 2, 4], 6) == [1, 2]
    assert two_sum([3, 3], 6) == [0, 1]
    assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4]
    assert two_sum([0, 4], 4) == [0, 1]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
