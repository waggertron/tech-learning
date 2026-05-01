def longest_common_subsequence(text1, text2):
    pass  # TODO: implement

def _run_tests():
    assert longest_common_subsequence('abcde', 'ace') == 3
    assert longest_common_subsequence('abc', 'abc') == 3
    assert longest_common_subsequence('abc', 'def') == 0
    assert longest_common_subsequence('', 'abc') == 0
    assert longest_common_subsequence('abc', '') == 0
    assert longest_common_subsequence('a', 'a') == 1
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
