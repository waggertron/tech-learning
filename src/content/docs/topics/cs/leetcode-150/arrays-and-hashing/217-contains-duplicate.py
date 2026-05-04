def contains_duplicate(nums: list[int]) -> bool:
    pass  # TODO: implement

def _run_tests():
    assert contains_duplicate([1, 2, 3, 1]) == True
    assert contains_duplicate([1, 2, 3, 4]) == False
    assert contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True
    assert contains_duplicate([]) == False
    assert contains_duplicate([5]) == False
    assert contains_duplicate([5, 5]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    contains_duplicate(list(range(10000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf contains_duplicate n=10000 unique: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
