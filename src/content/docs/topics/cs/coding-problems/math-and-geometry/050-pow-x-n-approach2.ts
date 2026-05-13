function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function myPow(x: number, n: number): number {
    if (n < 0) {                                    // L1: O(1)
        x = 1 / x;                                 // L2: O(1)
        n = -n;                                    // L3: O(1)
    }

    function helper(base: number, exp: number): number {
        if (exp === 0) return 1;                    // L4: base case O(1)
        const half = helper(base, Math.floor(exp / 2));  // L5: recurse on half exponent
        if (exp % 2 === 0) return half * half;      // L6: O(1)
        return half * half * base;                  // L7: O(1) for odd exp
    }

    return helper(x, n);
}

assert(Math.abs(myPow(2.0, 10) - 1024.0) < 1e-9);
assert(Math.abs(myPow(2.0, -2) - 0.25) < 1e-9);
assert(Math.abs(myPow(2.0, 0) - 1.0) < 1e-9);
assert(Math.abs(myPow(1.0, 1000000) - 1.0) < 1e-9);
assert(Math.abs(myPow(0.0, 5) - 0.0) < 1e-9);
assert(Math.abs(myPow(2.0, 1) - 2.0) < 1e-9);
console.log('all tests pass');
