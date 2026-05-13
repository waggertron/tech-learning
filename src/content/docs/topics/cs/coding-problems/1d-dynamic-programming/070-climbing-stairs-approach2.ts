function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

const memo = new Map<number, number>();

function climbStairs(n: number): number {
    if (n <= 2) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = climbStairs(n - 1) + climbStairs(n - 2);
    memo.set(n, result);
    return result;
}

assert(climbStairs(1) === 1);
assert(climbStairs(2) === 2);
assert(climbStairs(3) === 3);
assert(climbStairs(4) === 5);
assert(climbStairs(5) === 8);
assert(climbStairs(10) === 89);
console.log("all tests pass");
