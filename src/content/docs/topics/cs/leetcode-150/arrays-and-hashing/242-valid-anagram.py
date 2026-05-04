def is_anagram(s: str, t: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert is_anagram('anagram', 'nagaram') == True
    assert is_anagram('rat', 'car') == False
    assert is_anagram('a', 'a') == True
    assert is_anagram('ab', 'ba') == True
    assert is_anagram('ab', 'a') == False
    assert is_anagram('', '') == True
    # --- large-input timing ---
    import time as _t
    _s = 'abcdefghij' * 100
    _u = _s[::-1]
    _t0 = _t.perf_counter()
    is_anagram(_s, _u)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_anagram len=1000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
