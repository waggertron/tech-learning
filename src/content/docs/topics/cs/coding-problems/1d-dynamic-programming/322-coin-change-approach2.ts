function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function coinChange(coins: number[], amount: number): number {
    const memo = new Map<number, number>();
    function f(n: number): number {
        if (n === 0) return 0;
        if (n < 0) return Infinity;
        if (memo.has(n)) return memo.get(n)!;
        let best = Infinity;
        for (const c of coins) {
            best = Math.min(best, 1 + f(n - c));
        }
        memo.set(n, best);
        return best;
    }
    const result = f(amount);
    return result === Infinity ? -1 : result;
}

assert(coinChange([1, 2, 5], 11) === 3);
assert(coinChange([2], 3) === -1);
assert(coinChange([1], 0) === 0);
assert(coinChange([1], 1) === 1);
assert(coinChange([2, 5, 10, 1], 27) === 4);
assert(coinChange([186, 419, 83, 408], 6249) === 20);
console.log("all tests pass");
