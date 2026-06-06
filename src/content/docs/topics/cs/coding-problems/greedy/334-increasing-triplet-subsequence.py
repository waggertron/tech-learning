def increasing_triplet(nums: list[int]) -> bool:
    pass  # TODO: implement

def _run_tests() -> None:
    assert increasing_triplet([1, 2, 3, 4, 5]) == True
    assert increasing_triplet([5, 4, 3, 2, 1]) == False
    assert increasing_triplet([2, 1, 5, 0, 4, 6]) == True
    assert increasing_triplet([1, 2]) == False
    assert increasing_triplet([1, 1, 1, 1, 1]) == False
    assert increasing_triplet([20, 100, 10, 12, 5, 13]) == True
    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    increasing_triplet(list(range(500_000)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf increasing_triplet(n=500000): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
