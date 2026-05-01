def count_bits(n):
    pass  # TODO: implement

def _run_tests():
    assert count_bits(2) == [0, 1, 1]
    assert count_bits(5) == [0, 1, 1, 2, 1, 2]
    assert count_bits(0) == [0]
    assert count_bits(1) == [0, 1]
    assert count_bits(8) == [0, 1, 1, 2, 1, 2, 2, 3, 1]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
