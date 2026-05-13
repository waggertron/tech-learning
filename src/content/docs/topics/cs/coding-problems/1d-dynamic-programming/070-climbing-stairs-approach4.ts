function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function climbStairs(n: number): number {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

assert(climbStairs(1) === 1);
assert(climbStairs(2) === 2);
assert(climbStairs(3) === 3);
assert(climbStairs(4) === 5);
assert(climbStairs(5) === 8);
assert(climbStairs(10) === 89);
console.log("all tests pass");
