def insert(intervals, new_interval):
    result = []
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval = [min(new_interval[0], intervals[i][0]),
                        max(new_interval[1], intervals[i][1])]
        i += 1
    result.append(new_interval)

    while i < n:
        result.append(intervals[i])
        i += 1

    return result

assert insert([[1,3],[6,9]], [2,5]) == [[1,5],[6,9]]
assert insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) == [[1,2],[3,10],[12,16]]
assert insert([[3,5],[6,9]], [1,2]) == [[1,2],[3,5],[6,9]]
assert insert([[1,2],[3,5]], [7,9]) == [[1,2],[3,5],[7,9]]
assert insert([[1,2],[3,4],[5,6]], [0,10]) == [[0,10]]
assert insert([], [1,5]) == [[1,5]]
print("all tests pass")
