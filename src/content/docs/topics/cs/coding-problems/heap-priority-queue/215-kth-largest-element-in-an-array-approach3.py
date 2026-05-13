import random

def find_kth_largest(nums, k):
    # k-th largest = (n - k)-th smallest (0-indexed)
    target = len(nums) - k
    nums = list(nums)  # avoid mutating input

    def partition(lo, hi):
        pivot = nums[random.randint(lo, hi)]  # L1: O(1) random pivot
        left, right = lo, hi
        i = lo
        while i <= right:                      # L2: three-way partition
            if nums[i] < pivot:
                nums[left], nums[i] = nums[i], nums[left]
                left += 1; i += 1
            elif nums[i] > pivot:
                nums[right], nums[i] = nums[i], nums[right]
                right -= 1
            else:
                i += 1
        return left, right   # pivot's final range [left, right]

    def quickselect(lo, hi):
        while True:
            if lo == hi:
                return nums[lo]
            l, r = partition(lo, hi)          # L3: O(hi - lo) per call
            if l <= target <= r:
                return nums[target]
            elif target < l:
                hi = l - 1
            else:
                lo = r + 1

    return quickselect(0, len(nums) - 1)

assert find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5
assert find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4
assert find_kth_largest([1], 1) == 1
assert find_kth_largest([2, 2, 2, 2], 2) == 2
assert find_kth_largest([5, 3, 1, 4, 2], 5) == 1
print("all tests pass")
