def is_interleave(s1, s2, s3):
    pass  # TODO: implement

def _run_tests():
    assert is_interleave('aabcc', 'dbbca', 'aadbbcbcac') == True
    assert is_interleave('aabcc', 'dbbca', 'aadbbbaccc') == False
    assert is_interleave('', '', '') == True
    assert is_interleave('a', '', 'a') == True
    assert is_interleave('', 'b', 'b') == True
    assert is_interleave('a', 'b', 'abc') == False
    # --- large-input timing ---
    import time as _t
    _s1 = 'a' * 100
    _s2 = 'b' * 100
    _t0 = _t.perf_counter()
    is_interleave(_s1, _s2, _s1 + _s2)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_interleave("a"*100, "b"*100, s1+s2): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
