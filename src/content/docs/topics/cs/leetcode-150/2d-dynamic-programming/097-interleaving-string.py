def is_interleave(s1, s2, s3):
    pass  # TODO: implement

def _run_tests():
    assert is_interleave('aabcc', 'dbbca', 'aadbbcbcac') == True
    assert is_interleave('aabcc', 'dbbca', 'aadbbbaccc') == False
    assert is_interleave('', '', '') == True
    assert is_interleave('a', '', 'a') == True
    assert is_interleave('', 'b', 'b') == True
    assert is_interleave('a', 'b', 'abc') == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
