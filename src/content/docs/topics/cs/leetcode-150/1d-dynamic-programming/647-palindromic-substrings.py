def count_substrings(s):
    pass  # TODO: implement

def _run_tests():
    assert count_substrings('abc') == 3
    assert count_substrings('aaa') == 6
    assert count_substrings('a') == 1
    assert count_substrings('aa') == 3
    assert count_substrings('abba') == 6
    assert count_substrings('racecar') == 10
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
