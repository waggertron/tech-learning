def partition(s):
    pass  # TODO: implement

def _run_tests():
    r = partition('aab')
    assert sorted(map(tuple, r)) == sorted([('a', 'a', 'b'), ('aa', 'b')])
    assert partition('a') == [['a']]
    r3 = partition('aaa')
    assert sorted(map(tuple, r3)) == sorted([('a', 'a', 'a'), ('a', 'aa'), ('aa', 'a'), ('aaa',)])
    r4 = partition('abc')
    assert sorted(map(tuple, r4)) == sorted([('a', 'b', 'c')])
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    partition('aabbccddeeff')
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf partition("aabbccddeeff") n=12: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
