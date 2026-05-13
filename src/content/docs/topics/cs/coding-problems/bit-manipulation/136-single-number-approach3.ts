function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function singleNumber(nums: number[]): number {
    let result = 0;                         // L1: O(1)
    for (const x of nums) {                // L2: single pass, n iterations
        result ^= x;                        // L3: O(1), XOR accumulate
    }
    return result;
}

assert(singleNumber([2, 2, 1]) === 1);
assert(singleNumber([4, 1, 2, 1, 2]) === 4);
assert(singleNumber([1]) === 1);
assert(singleNumber([0, 0, 99]) === 99);
assert(singleNumber([-1, -1, 42]) === 42);
assert(singleNumber([2 ** 31 - 1]) === 2 ** 31 - 1);
console.log("all tests pass");
