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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
