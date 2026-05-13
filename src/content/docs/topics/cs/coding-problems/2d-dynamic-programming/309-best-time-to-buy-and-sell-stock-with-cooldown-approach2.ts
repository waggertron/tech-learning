function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProfit(prices: number[]): number {
    const n = prices.length;
    const memo: Map<string, number> = new Map();
    function f(i: number, holding: boolean, cooldown: boolean): number {
        if (i === n) return 0;
        const key = `${i},${holding},${cooldown}`;
        if (memo.has(key)) return memo.get(key)!;
        let best = f(i + 1, holding, false);
        if (holding) {
            best = Math.max(best, prices[i] + f(i + 1, false, true));
        } else if (!cooldown) {
            best = Math.max(best, -prices[i] + f(i + 1, true, false));
        }
        memo.set(key, best);
        return best;
    }
    return f(0, false, false);
}

assert(maxProfit([1, 2, 3, 0, 2]) === 3);
assert(maxProfit([1]) === 0);
assert(maxProfit([]) === 0);
assert(maxProfit([5, 4, 3, 2, 1]) === 0);
assert(maxProfit([1, 2, 3, 4, 5]) === 4);
assert(maxProfit([1, 2]) === 1);
console.log("all tests pass");
