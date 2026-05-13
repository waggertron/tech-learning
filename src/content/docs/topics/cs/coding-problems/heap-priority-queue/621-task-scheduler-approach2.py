import heapq
from collections import Counter, deque

def least_interval(tasks, n):
    heap = [-c for c in Counter(tasks).values()]
    heapq.heapify(heap)                          # L1: O(t) heapify
    cooldown = deque()   # (ready_time, negated_count_remaining)
    time = 0
    while heap or cooldown:                       # L2: T iterations total
        time += 1
        if heap:
            c = heapq.heappop(heap) + 1          # L3: O(log t) pop
            if c < 0:
                cooldown.append((time + n, c))   # L4: O(1) enqueue
        if cooldown and cooldown[0][0] == time:
            _, c = cooldown.popleft()
            heapq.heappush(heap, c)              # L5: O(log t) push
    return time

assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 2) == 8
assert least_interval(['A', 'A', 'A', 'B', 'B', 'B'], 0) == 6
assert least_interval(['A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], 2) == 16
assert least_interval(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'], 2) == 8
assert least_interval(['A', 'A', 'A'], 3) == 9
assert least_interval(['A', 'A', 'A'], 0) == 3
print("all tests pass")
