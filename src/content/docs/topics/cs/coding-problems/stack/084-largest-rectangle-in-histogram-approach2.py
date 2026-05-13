def largest_rectangle_area(heights: list[int]) -> int:
    n = len(heights)
    left = [-1] * n
    right = [n] * n

    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)

    stack = []
    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)

    return max((heights[i] * (right[i] - left[i] - 1) for i in range(n)), default=0)

assert largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10
assert largest_rectangle_area([2, 4]) == 4
assert largest_rectangle_area([1]) == 1
assert largest_rectangle_area([6, 5, 4, 3, 2, 1]) == 12
assert largest_rectangle_area([1, 2, 3, 4, 5, 6]) == 12
assert largest_rectangle_area([2, 0, 2]) == 2
print("all tests pass")
