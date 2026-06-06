from functools import lru_cache

def max_profit(prices: list[int]) -> int:
    n = len(prices)
    @lru_cache(maxsize=None)
    def f(i, holding, cooldown):
        if i == n:
            return 0
        best = f(i + 1, holding, False)
        if holding:
            best = max(best, prices[i] + f(i + 1, False, True))
        elif not cooldown:
            best = max(best, -prices[i] + f(i + 1, True, False))
        return best
    return f(0, False, False)

assert max_profit([1, 2, 3, 0, 2]) == 3
assert max_profit([1]) == 0
assert max_profit([]) == 0
assert max_profit([5, 4, 3, 2, 1]) == 0
assert max_profit([1, 2, 3, 4, 5]) == 4
assert max_profit([1, 2]) == 1
print("all tests pass")
