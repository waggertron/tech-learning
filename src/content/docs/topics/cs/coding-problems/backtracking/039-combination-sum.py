def combination_sum(candidates, target):
    pass  # TODO: implement

def _run_tests():
    r = combination_sum([2, 3, 6, 7], 7)
    assert sorted(map(tuple, r)) == sorted([tuple([2, 2, 3]), tuple([7])])
    r2 = combination_sum([2, 3, 5], 8)
    assert sorted(map(tuple, r2)) == sorted([tuple([2, 2, 2, 2]), tuple([2, 3, 3]), tuple([3, 5])])
    assert combination_sum([3], 9) == [[3, 3, 3]]
    assert combination_sum([5], 3) == []
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    combination_sum([1, 2, 3, 4, 5], 15)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf combination_sum([1..5], target=15): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
