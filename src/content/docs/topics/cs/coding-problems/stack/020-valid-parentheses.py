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
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    is_valid('(' * 2500 + ')' * 2500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 5000-char balanced parens: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
