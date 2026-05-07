def character_replacement(s: str, k: int) -> int:
    pass  # TODO: implement

def _run_tests():
    assert character_replacement('ABAB', 2) == 4
    assert character_replacement('AABABBA', 1) == 4
    assert character_replacement('A', 0) == 1
    assert character_replacement('AAAA', 2) == 4
    assert character_replacement('ABCDE', 1) == 2
    assert character_replacement('AABBA', 2) == 5
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    character_replacement('abcd' * 2500, 1000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-char string k=1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
