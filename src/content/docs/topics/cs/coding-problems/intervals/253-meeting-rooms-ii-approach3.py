def min_meeting_rooms(intervals: list[list[int]]) -> int:
    starts = sorted(s for s, _ in intervals)
    ends   = sorted(e for _, e in intervals)
    i = j = 0
    used = best = 0
    while i < len(intervals):
        if starts[i] < ends[j]:
            used += 1
            best = max(best, used)
            i += 1
        else:
            used -= 1
            j += 1
    return best

assert min_meeting_rooms([[0,30],[5,10],[15,20]]) == 2
assert min_meeting_rooms([[7,10],[2,4]]) == 1
assert min_meeting_rooms([[1,5]]) == 1
assert min_meeting_rooms([]) == 0
assert min_meeting_rooms([[1,4],[2,5],[3,6]]) == 3
assert min_meeting_rooms([[0,5],[5,10],[10,15]]) == 1
print("all tests pass")
