def can_jump(nums):
    pass  # TODO: implement

def _run_tests():
    assert can_jump([2, 3, 1, 1, 4]) == True
    assert can_jump([3, 2, 1, 0, 4]) == False
    assert can_jump([0]) == True
    assert can_jump([1, 0]) == True
    assert can_jump([0, 1]) == False
    assert can_jump([2, 0, 0]) == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
