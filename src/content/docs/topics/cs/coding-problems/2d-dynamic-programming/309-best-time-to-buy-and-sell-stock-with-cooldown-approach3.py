def max_profit(prices):
    if not prices:
        return 0
    hold = -prices[0]
    sold = 0
    rest = 0
    for i in range(1, len(prices)):
        prev_hold, prev_sold, prev_rest = hold, sold, rest
        hold = max(prev_hold, prev_rest - prices[i])
        sold = prev_hold + prices[i]
        rest = max(prev_rest, prev_sold)
    return max(sold, rest)

assert max_profit([1, 2, 3, 0, 2]) == 3
assert max_profit([1]) == 0
assert max_profit([]) == 0
assert max_profit([5, 4, 3, 2, 1]) == 0
assert max_profit([1, 2, 3, 4, 5]) == 4
assert max_profit([1, 2]) == 1
print("all tests pass")
