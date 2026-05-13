def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    count = 0
    prev_end = float('-inf')
    for s, e in intervals:
        if s >= prev_end:
            prev_end = e
        else:
            count += 1
            prev_end = min(prev_end, e)
    return count

assert erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) == 1
assert erase_overlap_intervals([[1,2],[1,2],[1,2]]) == 2
assert erase_overlap_intervals([[1,2],[2,3]]) == 0
assert erase_overlap_intervals([[1,5]]) == 0
assert erase_overlap_intervals([]) == 0
assert erase_overlap_intervals([[1,100],[2,3],[4,5],[6,7]]) == 1
print("all tests pass")
