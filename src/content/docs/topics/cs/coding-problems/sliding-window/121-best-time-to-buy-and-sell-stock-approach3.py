def max_profit(prices: list[int]) -> int:
    lowest = float('inf')             # L1: O(1)
    best = 0                          # L2: O(1)
    for price in prices:              # L3: single loop, n iterations
        if price < lowest:            # L4: O(1) comparison
            lowest = price            # L5: O(1) update buy candidate
        else:
            best = max(best, price - lowest)  # L6: O(1) profit check
    return best

assert max_profit([7, 1, 5, 3, 6, 4]) == 5
assert max_profit([7, 6, 4, 3, 1]) == 0
assert max_profit([1]) == 0
assert max_profit([1, 2]) == 1
assert max_profit([2, 4, 1]) == 2
assert max_profit([3, 3, 3]) == 0
print("all tests pass")
