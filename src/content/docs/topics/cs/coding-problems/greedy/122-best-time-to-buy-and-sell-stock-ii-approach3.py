from typing import List

def maxProfit(prices: List[int]) -> int:
    cash = 0                 # best profit while holding no share
    hold = float('-inf')     # best profit while holding one share
    for p in prices:
        cash = max(cash, hold + p)   # sell today, or stay in cash
        hold = max(hold, cash - p)   # buy today, or keep holding
    return cash

print(maxProfit([7, 1, 5, 3, 6, 4]))  # 7
print(maxProfit([1, 2, 3, 4, 5]))     # 4
print(maxProfit([7, 6, 4, 3, 1]))     # 0
