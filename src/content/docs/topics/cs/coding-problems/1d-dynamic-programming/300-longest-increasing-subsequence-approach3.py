from bisect import bisect_left

def length_of_lis(nums: list[int]) -> int:
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

assert length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4
assert length_of_lis([0, 1, 0, 3, 2, 3]) == 4
assert length_of_lis([7, 7, 7, 7]) == 1
assert length_of_lis([1]) == 1
assert length_of_lis([1, 2, 3, 4, 5]) == 5
assert length_of_lis([5, 4, 3, 2, 1]) == 1
print("all tests pass")
