def two_sum(numbers: list[int], target: int) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert two_sum([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum([2, 3, 4], 6) == [1, 3]
    assert two_sum([3, 3], 6) == [1, 2]
    assert two_sum([1, 2, 3, 4, 5], 9) == [4, 5]
    assert two_sum([-3, -1, 0, 2, 4], 1) == [1, 5]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
