def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer

assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]
assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]
assert product_except_self([1, 1]) == [1, 1]
assert product_except_self([2, 3]) == [3, 2]
assert product_except_self([1, 0]) == [0, 1]
print("all tests pass")
