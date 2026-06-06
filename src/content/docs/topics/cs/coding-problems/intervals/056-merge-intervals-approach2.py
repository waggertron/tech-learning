def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    result = []
    for interval in intervals:
        if result and interval[0] <= result[-1][1]:
            result[-1][1] = max(result[-1][1], interval[1])
        else:
            result.append(list(interval))
    return result

assert merge([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
assert merge([[1,4],[4,5]]) == [[1,5]]
assert merge([[1,2]]) == [[1,2]]
assert merge([[1,10],[2,5],[3,8]]) == [[1,10]]
assert merge([[1,2],[3,4],[5,6]]) == [[1,2],[3,4],[5,6]]
assert merge([[15,18],[1,3],[2,6],[8,10]]) == [[1,6],[8,10],[15,18]]
print("all tests pass")
