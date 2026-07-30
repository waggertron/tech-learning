def min_sub_array_len(target: int, nums: list[int]) -> int:
    pass  # TODO: implement


def _run_tests():
    assert min_sub_array_len(7, [2, 3, 1, 2, 4, 3]) == 2
    assert min_sub_array_len(4, [1, 4, 4]) == 1
    assert min_sub_array_len(11, [1, 1, 1, 1, 1, 1, 1, 1]) == 0
    assert min_sub_array_len(3, [1, 1, 1]) == 3
    assert min_sub_array_len(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]) == 2

    # --- large-input timing ---
    import time as _t

    _t0 = _t.perf_counter()
    min_sub_array_len(5000, [1] * 10000)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f"perf minimum-size-subarray-sum n=10000: {_ms:.1f}ms")
    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
