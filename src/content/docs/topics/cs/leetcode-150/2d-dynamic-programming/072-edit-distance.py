def min_distance(word1, word2):
    pass  # TODO: implement

def _run_tests():
    assert min_distance('horse', 'ros') == 3
    assert min_distance('intention', 'execution') == 5
    assert min_distance('', '') == 0
    assert min_distance('abc', '') == 3
    assert min_distance('', 'abc') == 3
    assert min_distance('abc', 'abc') == 0
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
