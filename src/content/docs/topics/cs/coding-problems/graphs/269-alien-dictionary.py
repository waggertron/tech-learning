def alien_order(words):
    pass  # TODO: implement

def _run_tests():
    result = alien_order(['wrt', 'wrf', 'er', 'ett', 'rftt'])
    assert result == 'wertf', f'got {result!r}'
    result = alien_order(['z', 'x'])
    assert result == 'zx', f'got {result!r}'
    assert alien_order(['z', 'x', 'z']) == ''
    assert alien_order(['abc', 'ab']) == ''
    result = alien_order(['abc'])
    assert set(result) == set('abc'), f'got {result!r}'
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    big_words = [chr(ord('a') + i % 26) * 3 + chr(ord('a') + (i + 1) % 26) for i in range(200)]
    alien_order(big_words)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf alien-dictionary 200 words: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
