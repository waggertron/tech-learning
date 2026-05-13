function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProfit(prices: number[]): number {
    let lowest = Infinity;                    // L1: O(1)
    let best = 0;                             // L2: O(1)
    for (const price of prices) {            // L3: single loop, n iterations
        if (price < lowest) {                // L4: O(1) comparison
            lowest = price;                  // L5: O(1) update buy candidate
        } else {
            best = Math.max(best, price - lowest);  // L6: O(1) profit check
        }
    }
    return best;
}

assert(maxProfit([7, 1, 5, 3, 6, 4]) === 5);
assert(maxProfit([7, 6, 4, 3, 1]) === 0);
assert(maxProfit([1]) === 0);
assert(maxProfit([1, 2]) === 1);
assert(maxProfit([2, 4, 1]) === 2);
assert(maxProfit([3, 3, 3]) === 0);
console.log('all tests pass');
