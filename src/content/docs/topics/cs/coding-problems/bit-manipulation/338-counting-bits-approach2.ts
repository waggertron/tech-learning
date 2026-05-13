function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countBits(n: number): number[] {
    const dp = new Array(n + 1).fill(0);        // L1: O(n)
    for (let i = 1; i <= n; i++) {              // L2: single pass, n iterations
        dp[i] = dp[i >> 1] + (i & 1);          // L3: O(1) per i
    }
    return dp;
}

assert(JSON.stringify(countBits(2)) === JSON.stringify([0, 1, 1]));
assert(JSON.stringify(countBits(5)) === JSON.stringify([0, 1, 1, 2, 1, 2]));
assert(JSON.stringify(countBits(0)) === JSON.stringify([0]));
assert(JSON.stringify(countBits(1)) === JSON.stringify([0, 1]));
assert(JSON.stringify(countBits(8)) === JSON.stringify([0, 1, 1, 2, 1, 2, 2, 3, 1]));
console.log("all tests pass");
