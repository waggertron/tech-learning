function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function getSum(a: number, b: number): number {
    const MASK = 0xFFFFFFFF;
    const MAX_INT = 0x7FFFFFFF;
    while (b !== 0) {                                       // L1: loop at most 32 times
        const carry = ((a & b) << 1) & MASK;               // L2a: O(1), compute carry
        a = (a ^ b) & MASK;                                 // L2b: O(1), sum without carry
        b = carry;
    }
    return a <= MAX_INT ? a : ~(a ^ MASK);                  // L3: O(1) sign correction
}

assert(getSum(1, 2) === 3);
assert(getSum(2, 3) === 5);
assert(getSum(0, 0) === 0);
assert(getSum(-1, 1) === 0);
assert(getSum(-5, 3) === -2);
assert(getSum(2 ** 30, 2 ** 30) === 2 ** 31);
console.log("all tests pass");
