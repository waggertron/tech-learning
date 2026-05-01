def my_pow(x, n):
    pass  # TODO: implement

def _run_tests():
    assert abs(my_pow(2.0, 10) - 1024.0) < 1e-09
    assert abs(my_pow(2.0, -2) - 0.25) < 1e-09
    assert abs(my_pow(2.0, 0) - 1.0) < 1e-09
    assert abs(my_pow(1.0, 1000000) - 1.0) < 1e-09
    assert abs(my_pow(0.0, 5) - 0.0) < 1e-09
    assert abs(my_pow(2.0, 1) - 2.0) < 1e-09
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
