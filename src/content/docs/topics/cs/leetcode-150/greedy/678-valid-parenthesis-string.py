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
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    check_valid_string('(*' * 5000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf check_valid_string(n=10000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
