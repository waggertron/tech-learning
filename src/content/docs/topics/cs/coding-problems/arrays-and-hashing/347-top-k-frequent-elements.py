def top_k_frequent(nums: list[int], k: int) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]
    assert top_k_frequent([1], 1) == [1]
    assert sorted(top_k_frequent([1, 2], 2)) == [1, 2]
    r = top_k_frequent([1, 2, 3], 1)
    assert len(r) == 1 and r[0] in [1, 2, 3]
    # --- large-input timing ---
    import time as _t
    _nums = [i % 100 for i in range(10000)]
    _t0 = _t.perf_counter()
    top_k_frequent(_nums, 10)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf top_k_frequent n=10000 k=10: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
