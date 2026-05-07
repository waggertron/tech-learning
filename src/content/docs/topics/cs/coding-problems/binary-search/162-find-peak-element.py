def find_peak_element(nums: list) -> int:
    pass  # TODO: implement

def _run_tests():
    # Single peak
    result = find_peak_element([1, 2, 3, 1])
    assert result == 2, result

    # Multiple peaks, accept any valid one
    result = find_peak_element([1, 2, 1, 3, 5, 6, 4])
    assert result in (1, 5), result

    # Single element
    assert find_peak_element([1]) == 0

    # Strictly ascending: last element is a peak
    assert find_peak_element([1, 2, 3]) == 2

    # Strictly descending: first element is a peak
    assert find_peak_element([3, 2, 1]) == 0

    # --- large-input timing ---
    import time as _t
    import random
    _nums = [random.randint(0, 10**6) for _ in range(10**5)]
    _t0 = _t.perf_counter()
    find_peak_element(_nums)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf find_peak_element(100000 elements): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
