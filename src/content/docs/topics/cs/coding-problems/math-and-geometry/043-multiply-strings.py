def multiply(num1, num2):
    pass  # TODO: implement

def _run_tests():
    assert multiply('2', '3') == '6'
    assert multiply('123', '456') == '56088'
    assert multiply('0', '12345') == '0'
    assert multiply('99', '99') == '9801'
    assert multiply('1', '1') == '1'
    assert multiply('9999', '9999') == '99980001'

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    multiply('9' * 100, '9' * 100)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf multiply 100-digit strings: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
