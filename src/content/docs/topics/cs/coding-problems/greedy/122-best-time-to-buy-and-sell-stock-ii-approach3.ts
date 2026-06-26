function maxProfit(prices: number[]): number {
    let cash = 0;                  // best profit while holding no share
    let hold = -Infinity;          // best profit while holding one share
    for (const p of prices) {
        cash = Math.max(cash, hold + p);   // sell today, or stay in cash
        hold = Math.max(hold, cash - p);   // buy today, or keep holding
    }
    return cash;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));  // 7
console.log(maxProfit([1, 2, 3, 4, 5]));     // 4
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0
