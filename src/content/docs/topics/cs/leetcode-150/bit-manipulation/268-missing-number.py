def missing_number(nums):
    pass  # TODO: implement

def _run_tests():
    assert missing_number([3, 0, 1]) == 2
    assert missing_number([0, 1]) == 2
    assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
    assert missing_number([0]) == 1
    assert missing_number([1]) == 0
    assert missing_number([0, 1, 2, 4, 5]) == 3
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
