function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostClimbingStairs(cost: number[]): number {
    const n = cost.length;
    let a = cost[0], b = cost[1];
    for (let i = 2; i < n; i++) {
        [a, b] = [b, cost[i] + Math.min(a, b)];
    }
    return Math.min(a, b);
}

assert(minCostClimbingStairs([10, 15, 20]) === 15);
assert(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) === 6);
assert(minCostClimbingStairs([0, 0]) === 0);
assert(minCostClimbingStairs([1, 2]) === 1);
assert(minCostClimbingStairs([5, 3, 1, 2]) === 4);
console.log("all tests pass");
