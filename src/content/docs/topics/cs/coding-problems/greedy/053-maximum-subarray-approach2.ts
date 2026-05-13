function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxSubarray(nums: number[]): number {
    function helper(lo: number, hi: number): number {
        if (lo === hi) return nums[lo];
        const mid = (lo + hi) >> 1;
        const leftMax = helper(lo, mid);
        const rightMax = helper(mid + 1, hi);

        let leftSuffix = -Infinity;
        let total = 0;
        for (let i = mid; i >= lo; i--) {
            total += nums[i];
            if (total > leftSuffix) leftSuffix = total;
        }
        let rightPrefix = -Infinity;
        total = 0;
        for (let i = mid + 1; i <= hi; i++) {
            total += nums[i];
            if (total > rightPrefix) rightPrefix = total;
        }
        return Math.max(leftMax, rightMax, leftSuffix + rightPrefix);
    }
    return helper(0, nums.length - 1);
}

assert(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6);
assert(maxSubarray([1]) === 1);
assert(maxSubarray([5, 4, -1, 7, 8]) === 23);
assert(maxSubarray([-1]) === -1);
assert(maxSubarray([-2, -3, -1, -5]) === -1);
assert(maxSubarray([1, 2, 3, 4, 5]) === 15);
console.log("all tests pass");
