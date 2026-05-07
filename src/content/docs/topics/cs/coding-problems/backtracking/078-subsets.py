def subsets(nums):
    pass  # TODO: implement

def _run_tests():
    r = subsets([1, 2, 3])
    assert len(r) == 8
    assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (3,), (1, 2), (1, 3), (2, 3), (1, 2, 3)])
    r2 = subsets([0])
    assert sorted(map(tuple, r2)) == [(), (0,)]
    assert subsets([]) == [[]]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    subsets(list(range(12)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf subsets(n=12): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
