def num_decodings(s):
    pass  # TODO: implement

def _run_tests():
    assert num_decodings('12') == 2
    assert num_decodings('226') == 3
    assert num_decodings('06') == 0
    assert num_decodings('0') == 0
    assert num_decodings('1') == 1
    assert num_decodings('11106') == 2
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
