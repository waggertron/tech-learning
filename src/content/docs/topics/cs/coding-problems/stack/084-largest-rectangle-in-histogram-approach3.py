def largest_rectangle_area(heights: list[int]) -> int:
    stack = []
    best = 0
    heights = heights + [0]
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            top = stack.pop()
            height = heights[top]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best

assert largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10
assert largest_rectangle_area([2, 4]) == 4
assert largest_rectangle_area([1]) == 1
assert largest_rectangle_area([6, 5, 4, 3, 2, 1]) == 12
assert largest_rectangle_area([1, 2, 3, 4, 5, 6]) == 12
assert largest_rectangle_area([2, 0, 2]) == 2
print("all tests pass")
