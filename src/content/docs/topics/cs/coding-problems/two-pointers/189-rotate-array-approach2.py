from typing import List

def rotate(nums: List[int], k: int) -> None:
    n = len(nums)
    k %= n

    def reverse(lo: int, hi: int) -> None:
        while lo < hi:
            nums[lo], nums[hi] = nums[hi], nums[lo]
            lo += 1
            hi -= 1

    reverse(0, n - 1)   # whole array reversed
    reverse(0, k - 1)   # fix first k
    reverse(k, n - 1)   # fix the rest

nums1 = [1, 2, 3, 4, 5, 6, 7]
rotate(nums1, 3)
print(nums1)  # [5, 6, 7, 1, 2, 3, 4]
