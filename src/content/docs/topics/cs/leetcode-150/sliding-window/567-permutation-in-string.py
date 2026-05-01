from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert check_inclusion('ab', 'eidbaooo') == True
    assert check_inclusion('ab', 'eidboaoo') == False
    assert check_inclusion('a', 'a') == True
    assert check_inclusion('a', 'b') == False
    assert check_inclusion('abc', 'ab') == False
    assert check_inclusion('aab', 'aabc') == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
