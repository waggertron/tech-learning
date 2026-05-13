def next_greater_element(nums1: list[int], nums2: list[int]) -> list[int]:
    nge = {}
    stack = []

    for num in nums2:
        while stack and stack[-1] < num:
            nge[stack.pop()] = num
        stack.append(num)

    for num in stack:
        nge[num] = -1

    return [nge[x] for x in nums1]

assert next_greater_element([4, 1, 2], [1, 3, 4, 2]) == [-1, 3, -1]
assert next_greater_element([2, 4], [1, 2, 3, 4]) == [3, -1]
assert next_greater_element([1], [1]) == [-1]
print("all tests pass")
