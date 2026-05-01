def change(amount, coins):
    pass  # TODO: implement

def _run_tests():
    assert change(5, [1, 2, 5]) == 4
    assert change(3, [2]) == 0
    assert change(0, [1, 2, 5]) == 1
    assert change(10, [5]) == 1
    assert change(10, [1, 5, 10]) == 4
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
