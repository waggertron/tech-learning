def plus_one(digits):
    pass  # TODO: implement

def _run_tests():
    assert plus_one([1, 2, 3]) == [1, 2, 4]
    assert plus_one([9, 9, 9]) == [1, 0, 0, 0]
    assert plus_one([0]) == [1]
    assert plus_one([9]) == [1, 0]
    assert plus_one([1, 0, 9]) == [1, 1, 0]
    assert plus_one([4, 3, 2, 1]) == [4, 3, 2, 2]

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    plus_one([9] * 1000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf plus_one 1000-digit all-nines: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
