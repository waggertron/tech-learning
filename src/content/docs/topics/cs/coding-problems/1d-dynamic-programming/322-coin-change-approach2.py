from functools import lru_cache

def coin_change(coins: list[int], amount: int) -> int:
    @lru_cache(maxsize=None)
    def f(n: int) -> float:
        if n == 0:
            return 0
        if n < 0:
            return float('inf')
        best = float('inf')
        for c in coins:
            best = min(best, 1 + f(n - c))
        return best
    result = f(amount)
    return -1 if result == float('inf') else result

assert coin_change([1, 2, 5], 11) == 3
assert coin_change([2], 3) == -1
assert coin_change([1], 0) == 0
assert coin_change([1], 1) == 1
assert coin_change([2, 5, 10, 1], 27) == 4
assert coin_change([186, 419, 83, 408], 6249) == 20
print("all tests pass")
