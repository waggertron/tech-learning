def is_anagram(s: str, t: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert is_anagram('anagram', 'nagaram') == True
    assert is_anagram('rat', 'car') == False
    assert is_anagram('a', 'a') == True
    assert is_anagram('ab', 'ba') == True
    assert is_anagram('ab', 'a') == False
    assert is_anagram('', '') == True
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
