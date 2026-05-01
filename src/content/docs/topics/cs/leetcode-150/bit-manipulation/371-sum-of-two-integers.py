def get_sum(a, b):
    pass  # TODO: implement

def _run_tests():
    assert get_sum(1, 2) == 3
    assert get_sum(2, 3) == 5
    assert get_sum(0, 0) == 0
    assert get_sum(-1, 1) == 0
    assert get_sum(-5, 3) == -2
    assert get_sum(2 ** 30, 2 ** 30) == 2 ** 31
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
