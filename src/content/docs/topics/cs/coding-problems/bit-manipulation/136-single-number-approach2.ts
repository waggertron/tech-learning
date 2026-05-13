function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function singleNumber(nums: number[]): number {
    nums.sort((a, b) => a - b);                 // L1: O(n log n)
    for (let i = 0; i < nums.length - 1; i += 2) {  // L2: scan in steps of 2
        if (nums[i] !== nums[i + 1]) return nums[i]; // L3: O(1)
    }
    return nums[nums.length - 1];               // L4: last element is single
}

assert(singleNumber([2, 2, 1]) === 1);
assert(singleNumber([4, 1, 2, 1, 2]) === 4);
assert(singleNumber([1]) === 1);
assert(singleNumber([0, 0, 99]) === 99);
assert(singleNumber([-1, -1, 42]) === 42);
assert(singleNumber([2 ** 31 - 1]) === 2 ** 31 - 1);
console.log("all tests pass");
