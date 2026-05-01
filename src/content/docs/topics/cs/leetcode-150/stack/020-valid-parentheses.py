def is_valid(s: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert is_valid('()') == True
    assert is_valid('()[]{}') == True
    assert is_valid('(]') == False
    assert is_valid('([)]') == False
    assert is_valid('{[]}') == True
    assert is_valid('') == True
    assert is_valid('(') == False
    assert is_valid(')') == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
