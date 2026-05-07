def first_uniq_char(s: str) -> int:
    pass  # TODO: implement

def _run_tests():
    assert first_uniq_char("leetcode") == 0
    assert first_uniq_char("loveleetcode") == 2
    assert first_uniq_char("aabb") == -1
    assert first_uniq_char("z") == 0
    assert first_uniq_char("aab") == 2
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    first_uniq_char("a" * 10000 + "b")
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf first_uniq_char n=10001: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
