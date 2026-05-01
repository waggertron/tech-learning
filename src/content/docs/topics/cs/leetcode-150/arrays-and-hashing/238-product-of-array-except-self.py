def product_except_self(nums: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]
    assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]
    assert product_except_self([1, 1]) == [1, 1]
    assert product_except_self([2, 3]) == [3, 2]
    assert product_except_self([1, 0]) == [0, 1]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
