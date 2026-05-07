def min_window(s: str, t: str) -> str:
    pass  # TODO: implement

def _run_tests():
    assert min_window('ADOBECODEBANC', 'ABC') == 'BANC'
    assert min_window('a', 'a') == 'a'
    assert min_window('a', 'aa') == ''
    assert min_window('', 'a') == ''
    assert min_window('abc', '') == ''
    assert min_window('aa', 'aa') == 'aa'
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    min_window('a' * 5000 + 'b' * 5000, 'ab')
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-char string: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
