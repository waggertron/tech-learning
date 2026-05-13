function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function hammingWeight(n: number): number {
    let count = 0;
    while (n) {                     // L1: loop popcount(n) times
        n &= n - 1;                 // L2: O(1), clear lowest set bit
        count++;                    // L3: O(1)
    }
    return count;
}

assert(hammingWeight(11) === 3);
assert(hammingWeight(128) === 1);
assert(hammingWeight(0) === 0);
assert(hammingWeight(4294967295) === 32);
assert(hammingWeight(1) === 1);
assert(hammingWeight(183) === 6);
console.log("all tests pass");
