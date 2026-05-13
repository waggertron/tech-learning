function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    const n = nums.length;
    const memo = new Map<number, number>();
    function f(i: number): number {
        if (i >= n) return 0;
        if (memo.has(i)) return memo.get(i)!;
        const result = Math.max(nums[i] + f(i + 2), f(i + 1));
        memo.set(i, result);
        return result;
    }
    return f(0);
}

assert(rob([1, 2, 3, 1]) === 4);
assert(rob([2, 7, 9, 3, 1]) === 12);
assert(rob([0]) === 0);
assert(rob([5]) === 5);
assert(rob([2, 1]) === 2);
assert(rob([1, 3, 1, 3, 100]) === 103);
console.log("all tests pass");
