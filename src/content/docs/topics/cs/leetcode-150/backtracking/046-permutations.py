def permute(nums):
    pass  # TODO: implement

def _run_tests():
    r = permute([1, 2, 3])
    assert len(r) == 6
    assert sorted(map(tuple, r)) == sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])
    r2 = permute([0, 1])
    assert sorted(map(tuple, r2)) == [(0, 1), (1, 0)]
    assert permute([1]) == [[1]]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    permute([1, 2, 3, 4, 5, 6, 7, 8])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf permute(n=8): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
