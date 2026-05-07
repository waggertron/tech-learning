def next_greater_elements(nums: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert next_greater_elements([1, 2, 1]) == [2, -1, 2]
    assert next_greater_elements([1, 2, 3, 4, 3]) == [2, 3, 4, -1, 4]
    assert next_greater_elements([5, 4, 3, 2, 1]) == [-1, 5, 5, 5, 5]
    assert next_greater_elements([1]) == [-1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
