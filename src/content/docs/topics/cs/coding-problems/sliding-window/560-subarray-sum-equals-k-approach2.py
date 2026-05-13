from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    count = defaultdict(int)      # L1: O(1)
    count[0] = 1                  # L2: O(1), seed for subarrays starting at index 0
    prefix = 0                    # L3: O(1)
    result = 0                    # L4: O(1)
    for x in nums:                # L5: loop, n iterations
        prefix += x               # L6: O(1) extend prefix sum
        result += count[prefix - k]   # L7: O(1) hash lookup
        count[prefix] += 1        # L8: O(1) record this prefix sum
    return result

assert subarray_sum([1, 1, 1], 2) == 2
assert subarray_sum([1, 2, 3], 3) == 2
assert subarray_sum([1], 0) == 0
assert subarray_sum([1], 1) == 1
assert subarray_sum([-1, -1, 1], 0) == 1
assert subarray_sum([0, 0, 0, 0], 0) == 10
print("all tests pass")
