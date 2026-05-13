class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i, v in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + v

    def sum_range(self, left: int, right: int) -> int:
        return self.prefix[right + 1] - self.prefix[left]

na = NumArray([-2, 0, 3, -5, 2, -1])
assert na.sum_range(0, 2) == 1
assert na.sum_range(2, 5) == -1
assert na.sum_range(0, 5) == -3
na2 = NumArray([5])
assert na2.sum_range(0, 0) == 5
na3 = NumArray([-1, -2, -3])
assert na3.sum_range(0, 2) == -6
assert na3.sum_range(1, 2) == -5
print("all tests pass")
