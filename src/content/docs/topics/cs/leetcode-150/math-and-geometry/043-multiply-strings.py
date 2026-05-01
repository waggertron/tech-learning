def multiply(num1, num2):
    pass  # TODO: implement

def _run_tests():
    assert multiply('2', '3') == '6'
    assert multiply('123', '456') == '56088'
    assert multiply('0', '12345') == '0'
    assert multiply('99', '99') == '9801'
    assert multiply('1', '1') == '1'
    assert multiply('9999', '9999') == '99980001'
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
