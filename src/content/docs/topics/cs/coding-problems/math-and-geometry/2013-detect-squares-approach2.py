from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)          # L1: O(1)
        self.points = set()                     # L2: O(1), distinct points for iteration

    def add(self, point):
        p = (point[0], point[1])
        self.counts[p] += 1                     # L3: O(1) amortized
        self.points.add(p)                      # L4: O(1) amortized

    def count(self, point):
        qx, qy = point
        total = 0
        for x, y in list(self.points):          # L5: iterate all distinct points, O(n)
            if abs(x - qx) == abs(y - qy) and x != qx and y != qy:  # L6: O(1)
                total += (self.counts[(x, y)]
                          * self.counts[(x, qy)]
                          * self.counts[(qx, y)])  # L7: O(1)
        return total

d = DetectSquares()
d.add([3, 10]); d.add([11, 2]); d.add([3, 2])
assert d.count([11, 10]) == 1
assert d.count([14, 8]) == 0
d.add([11, 2])
assert d.count([11, 10]) == 2
d2 = DetectSquares()
assert d2.count([0, 0]) == 0
d3 = DetectSquares()
d3.add([0, 0]); d3.add([2, 0]); d3.add([0, 2]); d3.add([2, 2])
assert d3.count([0, 0]) == 1
print("all tests pass")
