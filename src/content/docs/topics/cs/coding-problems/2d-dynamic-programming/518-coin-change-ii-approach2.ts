function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function change(amount: number, coins: number[]): number {
    const memo: Map<string, number> = new Map();
    function f(i: number, remaining: number): number {
        if (remaining === 0) return 1;
        if (remaining < 0 || i === coins.length) return 0;
        const key = `${i},${remaining}`;
        if (memo.has(key)) return memo.get(key)!;
        const result = f(i, remaining - coins[i]) + f(i + 1, remaining);
        memo.set(key, result);
        return result;
    }
    return f(0, amount);
}

assert(change(5, [1, 2, 5]) === 4);
assert(change(3, [2]) === 0);
assert(change(0, [1, 2, 5]) === 1);
assert(change(10, [5]) === 1);
assert(change(10, [1, 5, 10]) === 4);
console.log("all tests pass");
