import heapq

def last_stone_weight(stones):
    heap = [-(stone) for stone in stones]
    heapq.heapify(heap)

    while (len(heap) > 1):
        y = abs(heapq.heappop(heap))
        x = abs(heapq.heappop(heap))
        if y != x:
            heapq.heappush(heap, -(y - x))
    
    if heap:
        return abs(heap[0])

    return 0            


            
def _run_tests():
    assert last_stone_weight([2, 7, 4, 1, 8, 1]) == 1     # canonical: ends at 1
    assert last_stone_weight([1]) == 1                     # single stone
    assert last_stone_weight([31, 26, 33, 21, 40]) == 9    # no annihilations
    assert last_stone_weight([9, 3, 2, 10]) == 0           # chain of annihilations
    assert last_stone_weight([2, 2]) == 0                  # immediate annihilation
    assert last_stone_weight([1, 3]) == 2                  # one round, no destroy

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    last_stone_weight(list(range(1, 10001)))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf last_stone_weight n=10000: {_ms:.1f}ms')

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()