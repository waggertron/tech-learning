from functools import lru_cache

def change(amount: int, coins: list[int]) -> int:
    @lru_cache(maxsize=None)
    def f(i, remaining):
        if remaining == 0:
            return 1
        if remaining < 0 or i == len(coins):
            return 0
        return f(i, remaining - coins[i]) + f(i + 1, remaining)
    return f(0, amount)

assert change(5, [1, 2, 5]) == 4
assert change(3, [2]) == 0
assert change(0, [1, 2, 5]) == 1
assert change(10, [5]) == 1
assert change(10, [1, 5, 10]) == 4
print("all tests pass")
