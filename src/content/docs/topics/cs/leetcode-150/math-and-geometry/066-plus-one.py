def plus_one(digits):
    pass  # TODO: implement

def _run_tests():
    assert plus_one([1, 2, 3]) == [1, 2, 4]
    assert plus_one([9, 9, 9]) == [1, 0, 0, 0]
    assert plus_one([0]) == [1]
    assert plus_one([9]) == [1, 0]
    assert plus_one([1, 0, 9]) == [1, 1, 0]
    assert plus_one([4, 3, 2, 1]) == [4, 3, 2, 2]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
