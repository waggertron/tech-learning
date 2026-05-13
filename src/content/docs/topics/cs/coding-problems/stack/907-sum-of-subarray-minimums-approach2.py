def sum_subarray_mins(arr: list[int]) -> int:
    MOD = 10 ** 9 + 7
    n = len(arr)
    left = [0] * n
    right = [0] * n
    stack = []

    for i in range(n):
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()
        left[i] = i - stack[-1] if stack else i + 1
        stack.append(i)

    stack = []
    for i in range(n - 1, -1, -1):
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()
        right[i] = stack[-1] - i if stack else n - i
        stack.append(i)

    total = 0
    for i in range(n):
        total = (total + arr[i] * left[i] * right[i]) % MOD
    return total

assert sum_subarray_mins([3, 1, 2, 4]) == 17
assert sum_subarray_mins([11, 81, 94, 43, 3]) == 444
assert sum_subarray_mins([3]) == 3
print("all tests pass")
