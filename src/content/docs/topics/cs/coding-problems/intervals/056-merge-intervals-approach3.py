def merge(intervals):
    if not intervals:
        return []
    max_v = max(e for _, e in intervals)
    starts = [0] * (max_v + 2)
    ends = [0] * (max_v + 2)
    for s, e in intervals:
        starts[s] += 1
        ends[e] += 1

    result = []
    open_count = 0
    cur_start = None
    for i in range(max_v + 2):
        if starts[i] > 0 and open_count == 0:
            cur_start = i
        open_count += starts[i]
        if ends[i] > 0:
            open_count -= ends[i]
            if open_count == 0:
                result.append([cur_start, i])
    return result

assert merge([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
assert merge([[1,4],[4,5]]) == [[1,5]]
assert merge([[1,2]]) == [[1,2]]
assert merge([[1,10],[2,5],[3,8]]) == [[1,10]]
assert merge([[1,2],[3,4],[5,6]]) == [[1,2],[3,4],[5,6]]
assert merge([[15,18],[1,3],[2,6],[8,10]]) == [[1,6],[8,10],[15,18]]
print("all tests pass")
