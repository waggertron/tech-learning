function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function search(nums: number[], target: number): number {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}

assert(search([4, 5, 6, 7, 0, 1, 2], 0) === 4);
assert(search([4, 5, 6, 7, 0, 1, 2], 3) === -1);
assert(search([1], 0) === -1);
assert(search([1], 1) === 0);
assert(search([3, 1], 1) === 1);
assert(search([3, 1], 3) === 0);
console.log("all tests pass");
