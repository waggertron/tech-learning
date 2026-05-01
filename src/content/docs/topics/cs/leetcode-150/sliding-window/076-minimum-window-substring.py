from collections import Counter

def min_window(s: str, t: str) -> str:
    pass  # TODO: implement

def _run_tests():
    assert min_window('ADOBECODEBANC', 'ABC') == 'BANC'
    assert min_window('a', 'a') == 'a'
    assert min_window('a', 'aa') == ''
    assert min_window('', 'a') == ''
    assert min_window('abc', '') == ''
    assert min_window('aa', 'aa') == 'aa'
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
