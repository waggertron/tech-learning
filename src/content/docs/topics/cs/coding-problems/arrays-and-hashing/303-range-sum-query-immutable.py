class NumArray:
    def __init__(self, nums: list):
        pass  # TODO: implement

    def sum_range(self, left: int, right: int) -> int:
        pass  # TODO: implement

def _run_tests():
    na = NumArray([-2, 0, 3, -5, 2, -1])
    assert na.sum_range(0, 2) == 1
    assert na.sum_range(2, 5) == -1
    assert na.sum_range(0, 5) == -3

    # Single element
    na2 = NumArray([5])
    assert na2.sum_range(0, 0) == 5

    # All negative
    na3 = NumArray([-1, -2, -3])
    assert na3.sum_range(0, 2) == -6
    assert na3.sum_range(1, 2) == -5

    # --- large-input timing ---
    import time as _t
    _na = NumArray(list(range(10**5)))
    _t0 = _t.perf_counter()
    for i in range(0, 10**5, 100):
        _na.sum_range(0, i)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf 1000 queries on NumArray(100000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
