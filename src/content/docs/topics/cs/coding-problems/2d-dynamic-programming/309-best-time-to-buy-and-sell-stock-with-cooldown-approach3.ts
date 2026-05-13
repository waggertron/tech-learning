function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProfit(prices: number[]): number {
    if (prices.length === 0) return 0;
    let hold = -prices[0];
    let sold = 0;
    let rest = 0;
    for (let i = 1; i < prices.length; i++) {
        const prevHold = hold, prevSold = sold, prevRest = rest;
        hold = Math.max(prevHold, prevRest - prices[i]);
        sold = prevHold + prices[i];
        rest = Math.max(prevRest, prevSold);
    }
    return Math.max(sold, rest);
}

assert(maxProfit([1, 2, 3, 0, 2]) === 3);
assert(maxProfit([1]) === 0);
assert(maxProfit([]) === 0);
assert(maxProfit([5, 4, 3, 2, 1]) === 0);
assert(maxProfit([1, 2, 3, 4, 5]) === 4);
assert(maxProfit([1, 2]) === 1);
console.log("all tests pass");
