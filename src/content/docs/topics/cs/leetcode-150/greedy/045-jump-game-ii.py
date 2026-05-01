def jump(nums):
    pass  # TODO: implement

def _run_tests():
    assert jump([2, 3, 1, 1, 4]) == 2
    assert jump([2, 3, 0, 1, 4]) == 2
    assert jump([1]) == 0
    assert jump([1, 1, 1, 1]) == 3
    assert jump([5, 4, 3, 2, 1, 0]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
