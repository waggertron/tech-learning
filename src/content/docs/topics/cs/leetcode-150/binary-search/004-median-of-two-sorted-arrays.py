def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
    pass  # TODO: implement

def _run_tests():
    assert find_median_sorted_arrays([1, 3], [2]) == 2.0
    assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5
    assert find_median_sorted_arrays([0, 0], [0, 0]) == 0.0
    assert find_median_sorted_arrays([], [1]) == 1.0
    assert find_median_sorted_arrays([2], []) == 2.0
    assert find_median_sorted_arrays([1, 3], [2, 4]) == 2.5
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
