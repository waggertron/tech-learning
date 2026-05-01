INT_MIN = -2 ** 31

INT_MAX = 2 ** 31 - 1

def reverse(x):
    pass  # TODO: implement

def _run_tests():
    assert reverse(123) == 321
    assert reverse(-123) == -321
    assert reverse(120) == 21
    assert reverse(0) == 0
    assert reverse(2 ** 31 - 1) == 0
    assert reverse(1534236469) == 0
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
