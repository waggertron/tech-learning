def hamming_weight(n):
    pass  # TODO: implement

def _run_tests():
    assert hamming_weight(11) == 3
    assert hamming_weight(128) == 1
    assert hamming_weight(0) == 0
    assert hamming_weight(4294967295) == 32
    assert hamming_weight(1) == 1
    assert hamming_weight(183) == 6
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
