from typing import List

def maxProfit(prices: List[int], fee: int) -> int:
    profit = 0
    buy = prices[0] + fee                    # effective cost basis (price + fee)
    for p in prices[1:]:
        if p + fee < buy:                    # cheaper entry, reset cost basis
            buy = p + fee
        elif p > buy:                        # selling here beats holding
            profit += p - buy
            buy = p                           # roll basis forward, fee already paid
    return profit

print(maxProfit([1, 3, 2, 8, 4, 9], 2))  # 8
print(maxProfit([1, 3, 7, 5, 10, 3], 3)) # 6
