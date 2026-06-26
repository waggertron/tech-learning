function maxProfit(prices: number[]): number {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1])         // every up-day climb is free money
            profit += prices[i] - prices[i - 1];
    }
    return profit;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));  // 7
console.log(maxProfit([1, 2, 3, 4, 5]));     // 4
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0
