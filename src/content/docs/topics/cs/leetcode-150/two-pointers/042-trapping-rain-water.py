def trap(height: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
    assert trap([4, 2, 0, 3, 2, 5]) == 9
    assert trap([]) == 0
    assert trap([3]) == 0
    assert trap([3, 0, 3]) == 3
    assert trap([1, 0, 1]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
