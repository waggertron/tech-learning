def repeated_substring_pattern(s: str) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert repeated_substring_pattern("abab") == True
    assert repeated_substring_pattern("aba") == False
    assert repeated_substring_pattern("abcabcabcabc") == True
    assert repeated_substring_pattern("a") == False
    assert repeated_substring_pattern("aa") == True
    assert repeated_substring_pattern("abaaba") == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    repeated_substring_pattern("ab" * 5000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf repeated_substring_pattern n=10000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
