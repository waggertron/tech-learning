def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            count += 1
    return count

assert erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) == 1
assert erase_overlap_intervals([[1,2],[1,2],[1,2]]) == 2
assert erase_overlap_intervals([[1,2],[2,3]]) == 0
assert erase_overlap_intervals([[1,5]]) == 0
assert erase_overlap_intervals([]) == 0
assert erase_overlap_intervals([[1,100],[2,3],[4,5],[6,7]]) == 1
print("all tests pass")
