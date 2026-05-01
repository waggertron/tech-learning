def max_area(height: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
    assert max_area([1, 1]) == 1
    assert max_area([1, 2, 1]) == 2
    assert max_area([4, 3, 2, 1, 4]) == 16
    assert max_area([1, 2, 4, 3]) == 4
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
