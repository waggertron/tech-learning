def trap(height: list[int]) -> int:
    n = len(height)                                    # L1: O(1)
    if n == 0:                                         # L2: O(1) guard
        return 0
    left_max = [0] * n                                 # L3: O(n)
    right_max = [0] * n                                # L4: O(n)

    left_max[0] = height[0]                            # L5: O(1)
    for i in range(1, n):                              # L6: forward pass
        left_max[i] = max(left_max[i - 1], height[i]) # L7: O(1)

    right_max[n - 1] = height[n - 1]                  # L8: O(1)
    for i in range(n - 2, -1, -1):                    # L9: backward pass
        right_max[i] = max(right_max[i + 1], height[i])  # L10: O(1)

    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))  # L11: O(n)

assert trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
assert trap([4, 2, 0, 3, 2, 5]) == 9
assert trap([]) == 0
assert trap([3]) == 0
assert trap([3, 0, 3]) == 3
assert trap([1, 0, 1]) == 1
print('all tests pass')
