def sum_subarray_mins(arr: list[int]) -> int:
    pass  # TODO: implement

def _run_tests():
    assert sum_subarray_mins([3, 1, 2, 4]) == 17
    assert sum_subarray_mins([11, 81, 94, 43, 3]) == 444
    assert sum_subarray_mins([3]) == 3
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
