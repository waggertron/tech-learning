def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

assert rob([1, 2, 3, 1]) == 4
assert rob([2, 7, 9, 3, 1]) == 12
assert rob([0]) == 0
assert rob([5]) == 5
assert rob([2, 1]) == 2
assert rob([1, 3, 1, 3, 100]) == 103
print("all tests pass")
