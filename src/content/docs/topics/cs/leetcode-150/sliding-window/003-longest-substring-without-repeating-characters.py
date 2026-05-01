def length_of_longest_substring(s: str) -> int:
    pass  # TODO: implement

def _run_tests():
    assert length_of_longest_substring('abcabcbb') == 3
    assert length_of_longest_substring('bbbbb') == 1
    assert length_of_longest_substring('pwwkew') == 3
    assert length_of_longest_substring('') == 0
    assert length_of_longest_substring('a') == 1
    assert length_of_longest_substring('abcdef') == 6
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
