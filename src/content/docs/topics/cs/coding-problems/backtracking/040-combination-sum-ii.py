def combination_sum2(candidates, target):
    pass  # TODO: implement

def _run_tests():
    r = combination_sum2([10, 1, 2, 7, 6, 1, 5], 8)
    assert sorted(map(tuple, r)) == sorted([tuple([1, 1, 6]), tuple([1, 2, 5]), tuple([1, 7]), tuple([2, 6])])
    r2 = combination_sum2([2, 5, 2, 1, 2], 5)
    assert sorted(map(tuple, r2)) == sorted([tuple([1, 2, 2]), tuple([5])])
    assert combination_sum2([1, 2], 10) == []
    assert combination_sum2([3, 3], 3) == [[3]]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    combination_sum2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3], 15)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf combination_sum2(13 candidates, target=15): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
