def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []

    for i in range(2 * n):
        while stack and nums[stack[-1]] < nums[i % n]:
            result[stack.pop()] = nums[i % n]
        if i < n:
            stack.append(i)

    return result

assert next_greater_elements([1, 2, 1]) == [2, -1, 2]
assert next_greater_elements([1, 2, 3, 4, 3]) == [2, 3, 4, -1, 4]
assert next_greater_elements([5, 4, 3, 2, 1]) == [-1, 5, 5, 5, 5]
assert next_greater_elements([1]) == [-1]
print("all tests pass")
