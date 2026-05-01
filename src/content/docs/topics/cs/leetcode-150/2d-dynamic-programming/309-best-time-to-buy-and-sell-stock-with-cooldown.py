def max_profit(prices):
    pass  # TODO: implement

def _run_tests():
    assert max_profit([1, 2, 3, 0, 2]) == 3
    assert max_profit([1]) == 0
    assert max_profit([]) == 0
    assert max_profit([5, 4, 3, 2, 1]) == 0
    assert max_profit([1, 2, 3, 4, 5]) == 4
    assert max_profit([1, 2]) == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
