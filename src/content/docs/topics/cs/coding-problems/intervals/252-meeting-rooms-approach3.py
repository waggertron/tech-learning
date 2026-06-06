def can_attend_meetings(intervals: list[list[int]]) -> bool:
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort(key=lambda x: (x[0], x[1]))
    cur = 0
    for _, delta in events:
        cur += delta
        if cur > 1:
            return False
    return True

assert can_attend_meetings([[0,30],[5,10],[15,20]]) == False
assert can_attend_meetings([[7,10],[2,4]]) == True
assert can_attend_meetings([]) == True
assert can_attend_meetings([[1,5]]) == True
assert can_attend_meetings([[1,5],[5,10]]) == True
assert can_attend_meetings([[1,6],[5,10]]) == False
print("all tests pass")
