function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findPeakElement(nums: number[]): number {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

const r1 = findPeakElement([1, 2, 3, 1]);
assert(r1 === 2, `expected 2, got ${r1}`);

const r2 = findPeakElement([1, 2, 1, 3, 5, 6, 4]);
assert(r2 === 1 || r2 === 5, `expected 1 or 5, got ${r2}`);

assert(findPeakElement([1]) === 0);
assert(findPeakElement([1, 2, 3]) === 2);
assert(findPeakElement([3, 2, 1]) === 0);
console.log("all tests pass");
