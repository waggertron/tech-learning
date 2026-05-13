def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
    m, n = len(nums1), len(nums2)
    total = m + n
    need = total // 2 + 1

    i = j = 0
    prev = cur = 0
    for _ in range(need):
        prev = cur
        if i < m and (j >= n or nums1[i] <= nums2[j]):
            cur = nums1[i]
            i += 1
        else:
            cur = nums2[j]
            j += 1

    return float(cur) if total % 2 == 1 else (prev + cur) / 2

assert find_median_sorted_arrays([1, 3], [2]) == 2.0
assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5
assert find_median_sorted_arrays([0, 0], [0, 0]) == 0.0
assert find_median_sorted_arrays([], [1]) == 1.0
assert find_median_sorted_arrays([2], []) == 2.0
assert find_median_sorted_arrays([1, 3], [2, 4]) == 2.5
print("all tests pass")
