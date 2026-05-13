def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    s1 = set(nums1)
    s2 = set(nums2)
    return list(s1 & s2)

assert sorted(intersection([1,2,2,1], [2,2])) == [2]
assert sorted(intersection([4,9,5], [9,4,9,8,4])) == [4, 9]
assert intersection([1,2,3], [4,5,6]) == []
assert sorted(intersection([1,1,1], [1,1,1])) == [1]
assert sorted(intersection([1,2,3,4,5], [3,4,5,6,7])) == [3, 4, 5]
print("all tests pass")
