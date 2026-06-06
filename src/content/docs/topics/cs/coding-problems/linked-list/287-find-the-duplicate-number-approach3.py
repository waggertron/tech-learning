def find_duplicate(nums: list[int]) -> int:
    slow = nums[0]
    fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow

assert find_duplicate([1,3,4,2,2]) == 2
assert find_duplicate([3,1,3,4,2]) == 3
assert find_duplicate([3,3,3,3,3]) == 3
assert find_duplicate([1,1]) == 1
assert find_duplicate([2,2,2,1]) == 2
print("all tests pass")
