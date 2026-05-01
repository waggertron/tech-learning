def search(nums: list, target: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert search([4, 5, 6, 7, 0, 1, 2], 0) == 4
    assert search([4, 5, 6, 7, 0, 1, 2], 3) == -1
    assert search([1], 0) == -1
    assert search([1], 1) == 0
    assert search([3, 1], 1) == 1
    assert search([3, 1], 3) == 0
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
