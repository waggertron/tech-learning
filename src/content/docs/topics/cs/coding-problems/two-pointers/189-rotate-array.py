from typing import List

def rotate(nums: List[int], k: int) -> None:
    pass

nums1 = [1, 2, 3, 4, 5, 6, 7]
rotate(nums1, 3)
print(nums1)  # [5, 6, 7, 1, 2, 3, 4]

nums2 = [-1, -100, 3, 99]
rotate(nums2, 2)
print(nums2)  # [3, 99, -1, -100]
