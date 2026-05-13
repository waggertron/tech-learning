function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findMin(nums: number[]): number {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}

assert(findMin([3, 4, 5, 1, 2]) === 1);
assert(findMin([4, 5, 6, 7, 0, 1, 2]) === 0);
assert(findMin([11, 13, 15, 17]) === 11);
assert(findMin([1]) === 1);
assert(findMin([2, 1]) === 1);
assert(findMin([1, 2]) === 1);
console.log("all tests pass");
