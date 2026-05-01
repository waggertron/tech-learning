def coin_change(coins, amount):
    pass  # TODO: implement

def _run_tests():
    assert coin_change([1, 2, 5], 11) == 3
    assert coin_change([2], 3) == -1
    assert coin_change([1], 0) == 0
    assert coin_change([1], 1) == 1
    assert coin_change([2, 5, 10, 1], 27) == 4
    assert coin_change([186, 419, 83, 408], 6249) == 20
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
