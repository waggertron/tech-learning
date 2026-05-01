def can_partition(nums):
    pass  # TODO: implement

def _run_tests():
    assert can_partition([1, 5, 11, 5]) == True
    assert can_partition([1, 2, 3, 5]) == False
    assert can_partition([1]) == False
    assert can_partition([2, 2]) == True
    assert can_partition([1, 2, 5]) == False
    assert can_partition([3, 3, 3, 4, 5]) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
