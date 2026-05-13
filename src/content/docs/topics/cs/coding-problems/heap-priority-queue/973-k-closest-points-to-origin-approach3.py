def k_closest(points, k):
    points = [list(p) for p in points]  # avoid mutating input

    def dist(p):
        return p[0] ** 2 + p[1] ** 2

    def partition(lo, hi):                           # L1: O(hi - lo) per call
        pivot = dist(points[hi])
        store = lo
        for i in range(lo, hi):
            if dist(points[i]) <= pivot:
                points[store], points[i] = points[i], points[store]
                store += 1
        points[store], points[hi] = points[hi], points[store]
        return store

    def quickselect(lo, hi, k):
        if lo >= hi:                                 # L2: base case
            return
        p = partition(lo, hi)                        # L3: O(subarray size)
        if p == k:
            return
        if p < k:
            quickselect(p + 1, hi, k)               # L4: recurse right
        else:
            quickselect(lo, p - 1, k)               # L5: recurse left

    quickselect(0, len(points) - 1, k)
    return points[:k]

result = k_closest([[1, 3], [-2, 2]], 1)
assert sorted(result) == sorted([[-2, 2]]), f"got {result}"

result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
assert sorted(result) == sorted([[3, 3], [-2, 4]]), f"got {result}"

assert k_closest([[0, 0]], 1) == [[0, 0]]

result = k_closest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2)
assert len(result) == 2

result = k_closest([[1, 2], [3, 4], [0, 0]], 3)
assert len(result) == 3

print("all tests pass")
