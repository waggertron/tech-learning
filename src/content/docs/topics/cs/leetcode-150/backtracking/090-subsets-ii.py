def subsets_with_dup(nums):
    pass  # TODO: implement

def _run_tests():
    r = subsets_with_dup([1, 2, 2])
    assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (1, 2), (2, 2), (1, 2, 2)])
    r2 = subsets_with_dup([0])
    assert sorted(map(tuple, r2)) == [(), (0,)]
    r3 = subsets_with_dup([2, 2, 2])
    assert sorted(map(tuple, r3)) == sorted([(), (2,), (2, 2), (2, 2, 2)])
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    subsets_with_dup([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf subsets_with_dup(n=12 with dups): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
