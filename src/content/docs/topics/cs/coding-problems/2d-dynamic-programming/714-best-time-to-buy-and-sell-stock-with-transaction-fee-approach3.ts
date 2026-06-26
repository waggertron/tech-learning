function maxProfit(prices: number[], fee: number): number {
    let profit = 0;
    let buy = prices[0] + fee;               // effective cost basis (price + fee)
    for (let i = 1; i < prices.length; i++) {
        const p = prices[i];
        if (p + fee < buy) {                 // cheaper entry, reset cost basis
            buy = p + fee;
        } else if (p > buy) {                // selling here beats holding
            profit += p - buy;
            buy = p;                          // roll basis forward, fee already paid
        }
    }
    return profit;
}

console.log(maxProfit([1, 3, 2, 8, 4, 9], 2));  // 8
console.log(maxProfit([1, 3, 7, 5, 10, 3], 3)); // 6
