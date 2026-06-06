from functools import lru_cache

def min_cost_climbing_stairs(cost: list[int]) -> int:
    n = len(cost)
    @lru_cache(maxsize=None)
    def f(i: int) -> int:
        if i >= n:
            return 0
        return cost[i] + min(f(i + 1), f(i + 2))
    return min(f(0), f(1))

assert min_cost_climbing_stairs([10, 15, 20]) == 15
assert min_cost_climbing_stairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
assert min_cost_climbing_stairs([0, 0]) == 0
assert min_cost_climbing_stairs([1, 2]) == 1
assert min_cost_climbing_stairs([5, 3, 1, 2]) == 4
print("all tests pass")
