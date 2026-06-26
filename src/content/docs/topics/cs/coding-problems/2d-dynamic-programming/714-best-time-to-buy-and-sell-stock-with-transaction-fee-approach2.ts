function maxProfit(prices: number[], fee: number): number {
    let cash = 0;                            // best profit holding no share
    let hold = -prices[0];                   // best profit holding one share
    for (let i = 1; i < prices.length; i++) {
        const p = prices[i];
        cash = Math.max(cash, hold + p - fee);  // sell today, pay the fee once
        hold = Math.max(hold, cash - p);        // buy today, or keep holding
    }
    return cash;
}

console.log(maxProfit([1, 3, 2, 8, 4, 9], 2));  // 8
console.log(maxProfit([1, 3, 7, 5, 10, 3], 3)); // 6
