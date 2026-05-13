function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2;
    const memo = new Map<string, boolean>();
    function f(i: number, cur: number): boolean {
        if (cur === target) return true;
        if (i === nums.length || cur > target) return false;
        const key = `${i},${cur}`;
        if (memo.has(key)) return memo.get(key)!;
        const result = f(i + 1, cur + nums[i]) || f(i + 1, cur);
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(canPartition([1, 5, 11, 5]) === true);
assert(canPartition([1, 2, 3, 5]) === false);
assert(canPartition([1]) === false);
assert(canPartition([2, 2]) === true);
assert(canPartition([1, 2, 5]) === false);
assert(canPartition([3, 3, 3, 4, 5]) === true);
console.log("all tests pass");
