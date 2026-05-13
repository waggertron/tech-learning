def max_area(height: list[int]) -> int:
    l, r = 0, len(height) - 1           # L1: O(1) init pointers
    best = 0                             # L2: O(1)
    while l < r:                         # L3: loop, at most n iterations total
        area = min(height[l], height[r]) * (r - l)  # L4: O(1) area
        best = max(best, area)           # L5: O(1) update
        if height[l] < height[r]:        # L6: O(1) compare
            l += 1                       # L7: O(1) advance left
        else:
            r -= 1                       # L8: O(1) advance right
    return best

assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
assert max_area([1, 1]) == 1
assert max_area([1, 2, 1]) == 2
assert max_area([4, 3, 2, 1, 4]) == 16
assert max_area([1, 2, 4, 3]) == 4
print('all tests pass')
