from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()
    result = []
    for i, x in enumerate(nums):             # L1: outer loop, n iterations
        while dq and dq[0] <= i - k:         # L2: evict expired front, O(1) amortized
            dq.popleft()                     # L3: O(1)
        while dq and nums[dq[-1]] < x:       # L4: remove dominated back entries
            dq.pop()                         # L5: O(1)
        dq.append(i)                         # L6: O(1) push
        if i >= k - 1:
            result.append(nums[dq[0]])       # L7: O(1) read front
    return result

assert max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7]
assert max_sliding_window([1], 1) == [1]
assert max_sliding_window([1, -1], 1) == [1, -1]
assert max_sliding_window([9, 8, 7, 6, 5], 3) == [9, 8, 7]
assert max_sliding_window([1, 2, 3, 4, 5], 3) == [3, 4, 5]
print("all tests pass")
