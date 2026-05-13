import heapq
from collections import Counter

def is_n_straight_hand_heap(hand, group_size):
    if len(hand) % group_size != 0:
        return False
    counts = Counter(hand)
    heap = list(counts)
    heapq.heapify(heap)
    while heap:
        x = heap[0]
        if counts[x] == 0:
            heapq.heappop(heap)
            continue
        for k in range(group_size):
            if counts[x + k] == 0:
                return False
            counts[x + k] -= 1
        while heap and counts[heap[0]] == 0:
            heapq.heappop(heap)
    return True

assert is_n_straight_hand_heap([1,2,3,6,2,3,4,7,8], 3) == True
assert is_n_straight_hand_heap([1,2,3,4,5], 4) == False
assert is_n_straight_hand_heap([1], 1) == True
assert is_n_straight_hand_heap([1,2,3], 3) == True
assert is_n_straight_hand_heap([1,2,4], 3) == False
assert is_n_straight_hand_heap([1,1,2,2,3,3], 3) == True
print("all tests pass")
