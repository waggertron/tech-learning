def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1       # L1: O(1) init pointers
    left_max = right_max = 0        # L2: O(1) running maxes
    total = 0                       # L3: O(1)
    while l < r:                    # L4: loop, n iterations total
        if height[l] < height[r]:   # L5: O(1) compare sides
            if height[l] >= left_max:   # L6: O(1)
                left_max = height[l]    # L7: O(1) update max
            else:
                total += left_max - height[l]  # L8: O(1) collect water
            l += 1                  # L9: O(1) advance left
        else:
            if height[r] >= right_max:  # L10: O(1)
                right_max = height[r]   # L11: O(1) update max
            else:
                total += right_max - height[r]  # L12: O(1) collect water
            r -= 1                  # L13: O(1) advance right
    return total

assert trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
assert trap([4, 2, 0, 3, 2, 5]) == 9
assert trap([]) == 0
assert trap([3]) == 0
assert trap([3, 0, 3]) == 3
assert trap([1, 0, 1]) == 1
print('all tests pass')
