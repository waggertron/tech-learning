def min_cost_climbing_stairs(cost):
    n = len(cost)
    a, b = cost[0], cost[1]
    for i in range(2, n):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)

assert min_cost_climbing_stairs([10, 15, 20]) == 15
assert min_cost_climbing_stairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
assert min_cost_climbing_stairs([0, 0]) == 0
assert min_cost_climbing_stairs([1, 2]) == 1
assert min_cost_climbing_stairs([5, 3, 1, 2]) == 4
print("all tests pass")
