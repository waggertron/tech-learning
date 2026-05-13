function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const prefix = new Array(n).fill(1);
    const suffix = new Array(n).fill(1);
    for (let i = 1; i < n; i++)
        prefix[i] = prefix[i - 1] * nums[i - 1];     // L5: O(1)
    for (let i = n - 2; i >= 0; i--)
        suffix[i] = suffix[i + 1] * nums[i + 1];     // L7: O(1)
    return prefix.map((p, i) => p * suffix[i]);       // L8: O(n)
}

assert(JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6]));
assert(JSON.stringify(productExceptSelf([-1, 1, 0, -3, 3])) === JSON.stringify([0, 0, 9, 0, 0]));
assert(JSON.stringify(productExceptSelf([1, 1])) === JSON.stringify([1, 1]));
assert(JSON.stringify(productExceptSelf([2, 3])) === JSON.stringify([3, 2]));
assert(JSON.stringify(productExceptSelf([1, 0])) === JSON.stringify([0, 1]));
console.log("all tests pass");
