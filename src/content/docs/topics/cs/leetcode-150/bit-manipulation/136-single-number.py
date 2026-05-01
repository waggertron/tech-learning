def single_number(nums):
    pass  # TODO: implement

def _run_tests():
    assert single_number([2, 2, 1]) == 1
    assert single_number([4, 1, 2, 1, 2]) == 4
    assert single_number([1]) == 1
    assert single_number([0, 0, 99]) == 99
    assert single_number([-1, -1, 42]) == 42
    assert single_number([2 ** 31 - 1]) == 2 ** 31 - 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
