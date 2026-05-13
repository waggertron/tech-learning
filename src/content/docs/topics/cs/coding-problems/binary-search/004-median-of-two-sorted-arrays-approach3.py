def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2

    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i

        a_left  = nums1[i - 1] if i > 0 else float('-inf')
        a_right = nums1[i]     if i < m else float('inf')
        b_left  = nums2[j - 1] if j > 0 else float('-inf')
        b_right = nums2[j]     if j < n else float('inf')

        if a_left <= b_right and b_left <= a_right:
            if (m + n) % 2 == 1:
                return float(max(a_left, b_left))
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1
        else:
            lo = i + 1
    return 0.0

assert find_median_sorted_arrays([1, 3], [2]) == 2.0
assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5
assert find_median_sorted_arrays([0, 0], [0, 0]) == 0.0
assert find_median_sorted_arrays([], [1]) == 1.0
assert find_median_sorted_arrays([2], []) == 2.0
assert find_median_sorted_arrays([1, 3], [2, 4]) == 2.5
print("all tests pass")
