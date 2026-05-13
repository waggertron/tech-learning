function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostClimbingStairs(cost: number[]): number {
    const n = cost.length;
    const memo = new Map<number, number>();
    function f(i: number): number {
        if (i >= n) return 0;
        if (memo.has(i)) return memo.get(i)!;
        const result = cost[i] + Math.min(f(i + 1), f(i + 2));
        memo.set(i, result);
        return result;
    }
    return Math.min(f(0), f(1));
}

assert(minCostClimbingStairs([10, 15, 20]) === 15);
assert(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) === 6);
assert(minCostClimbingStairs([0, 0]) === 0);
assert(minCostClimbingStairs([1, 2]) === 1);
assert(minCostClimbingStairs([5, 3, 1, 2]) === 4);
console.log("all tests pass");
