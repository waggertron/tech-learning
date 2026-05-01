def num_distinct(s, t):
    pass  # TODO: implement

def _run_tests():
    assert num_distinct('rabbbit', 'rabbit') == 3
    assert num_distinct('babgbag', 'bag') == 5
    assert num_distinct('abc', '') == 1
    assert num_distinct('', 'a') == 0
    assert num_distinct('abc', 'abc') == 1
    assert num_distinct('aaa', 'b') == 0
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
