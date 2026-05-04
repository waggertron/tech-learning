def two_sum(numbers: list[int], target: int) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert two_sum([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum([2, 3, 4], 6) == [1, 3]
    assert two_sum([3, 3], 6) == [1, 2]
    assert two_sum([1, 2, 3, 4, 5], 9) == [4, 5]
    assert two_sum([-3, -1, 0, 2, 4], 1) == [1, 5]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    two_sum(list(range(1, 10001)), 19999)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 10000-element sorted array: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
