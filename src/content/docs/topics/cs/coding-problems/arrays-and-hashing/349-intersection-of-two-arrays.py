def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert sorted(intersection([1,2,2,1], [2,2])) == [2]
    assert sorted(intersection([4,9,5], [9,4,9,8,4])) == [4,9]
    assert intersection([1,2,3], [4,5,6]) == []
    assert sorted(intersection([1,1,1], [1,1,1])) == [1]
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    intersection(list(range(10000)), list(range(5000, 15000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf intersection n=10000: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
