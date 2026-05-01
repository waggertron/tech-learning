from functools import lru_cache

def is_match(s, p):
    pass  # TODO: implement

def _run_tests():
    assert is_match('aa', 'a') == False
    assert is_match('aa', 'a*') == True
    assert is_match('ab', '.*') == True
    assert is_match('mississippi', 'mis*is*p*.') == False
    assert is_match('', '') == True
    assert is_match('', 'a*') == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
