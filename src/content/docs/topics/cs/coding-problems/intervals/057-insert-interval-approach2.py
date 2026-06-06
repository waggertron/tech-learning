import bisect

def insert(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    intervals = [list(iv) for iv in intervals]
    starts = [iv[0] for iv in intervals]
    idx = bisect.bisect_left(starts, new_interval[0])
    intervals.insert(idx, list(new_interval))

    while idx > 0 and intervals[idx - 1][1] >= intervals[idx][0]:
        intervals[idx - 1][1] = max(intervals[idx - 1][1], intervals[idx][1])
        intervals.pop(idx)
        idx -= 1

    while idx + 1 < len(intervals) and intervals[idx][1] >= intervals[idx + 1][0]:
        intervals[idx][1] = max(intervals[idx][1], intervals[idx + 1][1])
        intervals.pop(idx + 1)

    return intervals

assert insert([[1,3],[6,9]], [2,5]) == [[1,5],[6,9]]
assert insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) == [[1,2],[3,10],[12,16]]
assert insert([[3,5],[6,9]], [1,2]) == [[1,2],[3,5],[6,9]]
assert insert([[1,2],[3,5]], [7,9]) == [[1,2],[3,5],[7,9]]
assert insert([[1,2],[3,4],[5,6]], [0,10]) == [[0,10]]
assert insert([], [1,5]) == [[1,5]]
print("all tests pass")
