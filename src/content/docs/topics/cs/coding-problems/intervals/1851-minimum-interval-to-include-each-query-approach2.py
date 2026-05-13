import heapq

def min_interval(intervals, queries):
    intervals.sort(key=lambda x: x[0])
    sorted_queries = sorted(enumerate(queries), key=lambda p: p[1])

    result = [0] * len(queries)
    heap = []   # (length, end)
    i = 0
    for orig_idx, q in sorted_queries:
        while i < len(intervals) and intervals[i][0] <= q:
            s, e = intervals[i]
            heapq.heappush(heap, (e - s + 1, e))
            i += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        result[orig_idx] = heap[0][0] if heap else -1
    return result

assert min_interval([[1,4],[2,4],[3,6],[4,4]], [2,3,4,5]) == [3,3,1,4]
assert min_interval([[2,3],[2,5],[1,8],[20,25]], [2,19,5,22]) == [2,-1,4,6]
assert min_interval([[1,3]], [5]) == [-1]
assert min_interval([[1,10]], [5]) == [10]
assert min_interval([[1,5],[2,3]], [2,3]) == [2,2]
print("all tests pass")
