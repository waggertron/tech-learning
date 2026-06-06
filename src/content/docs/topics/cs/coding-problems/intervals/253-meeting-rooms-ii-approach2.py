import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[0])
    heap = []
    for s, e in intervals:
        if heap and heap[0] <= s:
            heapq.heappop(heap)
        heapq.heappush(heap, e)
    return len(heap)

assert min_meeting_rooms([[0,30],[5,10],[15,20]]) == 2
assert min_meeting_rooms([[7,10],[2,4]]) == 1
assert min_meeting_rooms([[1,5]]) == 1
assert min_meeting_rooms([]) == 0
assert min_meeting_rooms([[1,4],[2,5],[3,6]]) == 3
assert min_meeting_rooms([[0,5],[5,10],[10,15]]) == 1
print("all tests pass")
