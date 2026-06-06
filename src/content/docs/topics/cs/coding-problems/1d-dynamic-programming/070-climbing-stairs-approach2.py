from functools import lru_cache

@lru_cache(maxsize=None)
def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)

assert climb_stairs(1) == 1
assert climb_stairs(2) == 2
assert climb_stairs(3) == 3
assert climb_stairs(4) == 5
assert climb_stairs(5) == 8
assert climb_stairs(10) == 89
print("all tests pass")
