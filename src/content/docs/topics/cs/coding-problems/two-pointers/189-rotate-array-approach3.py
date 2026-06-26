from typing import List

def rotate(nums: List[int], k: int) -> None:
    n = len(nums)
    k %= n
    count = 0
    start = 0
    while count < n:
        current = start
        prev = nums[start]
        while True:
            nxt = (current + k) % n
            nums[nxt], prev = prev, nums[nxt]
            current = nxt
            count += 1
            if start == current:
                break
        start += 1

nums1 = [1, 2, 3, 4, 5, 6, 7]
rotate(nums1, 3)
print(nums1)  # [5, 6, 7, 1, 2, 3, 4]
