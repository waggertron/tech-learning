def str_str(haystack: str, needle: str) -> int:
    pass  # TODO: implement

def _run_tests():
    assert str_str("sadbutsad", "sad") == 0
    assert str_str("leetcode", "leeto") == -1
    assert str_str("hello", "ll") == 2
    assert str_str("a", "a") == 0
    assert str_str("mississippi", "issip") == 4
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    str_str("a" * 10000 + "b", "ab")
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf str_str n=10001: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
