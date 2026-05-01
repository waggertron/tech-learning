def check_valid_string(s):
    pass  # TODO: implement

def _run_tests():
    assert check_valid_string('()') == True
    assert check_valid_string('(*)') == True
    assert check_valid_string('(*))') == True
    assert check_valid_string('((') == False
    assert check_valid_string('*') == True
    assert check_valid_string('(*') == True
    assert check_valid_string(')') == False
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
