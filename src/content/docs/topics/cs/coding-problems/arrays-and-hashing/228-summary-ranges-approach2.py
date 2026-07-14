def summary_ranges(nums: list[int]) -> list[str]:
    if not nums:
        return []

    ranges: list[str] = []
    start = nums[0]

    for i in range(1, len(nums) + 1):
        if i < len(nums) and nums[i] == nums[i - 1] + 1:
            continue

        end = nums[i - 1]
        ranges.append(str(start) if start == end else f"{start}->{end}")

        if i < len(nums):
            start = nums[i]

    return ranges


def _run_tests() -> None:
    assert summary_ranges([0, 1, 2, 4, 5, 7]) == ["0->2", "4->5", "7"]
    assert summary_ranges([0, 2, 3, 4, 6, 8, 9]) == ["0", "2->4", "6", "8->9"]
    assert summary_ranges([]) == []
    assert summary_ranges([5]) == ["5"]
    assert summary_ranges([-3, -2, -1, 1, 3, 4]) == ["-3->-1", "1", "3->4"]

    minimum = -(2**31)
    maximum = 2**31 - 1
    assert summary_ranges([minimum, minimum + 1, -1, 0, 1, maximum]) == [
        f"{minimum}->{minimum + 1}",
        "-1->1",
        str(maximum),
    ]

    assert summary_ranges(list(range(-10, 10))) == ["-10->9"]
    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
