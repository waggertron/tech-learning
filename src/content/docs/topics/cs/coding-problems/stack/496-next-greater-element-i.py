def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    pass  # TODO: implement

def _run_tests():
    assert next_greater_element([4, 1, 2], [1, 3, 4, 2]) == [-1, 3, -1]
    assert next_greater_element([2, 4], [1, 2, 3, 4]) == [3, -1]
    assert next_greater_element([1], [1]) == [-1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
