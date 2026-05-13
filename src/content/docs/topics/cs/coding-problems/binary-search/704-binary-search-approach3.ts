function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function search(nums: number[], target: number): number {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

assert(search([-1, 0, 3, 5, 9, 12], 9) === 4);
assert(search([-1, 0, 3, 5, 9, 12], 2) === -1);
assert(search([5], 5) === 0);
assert(search([5], 3) === -1);
assert(search([-1, 0, 3, 5, 9, 12], -1) === 0);
assert(search([-1, 0, 3, 5, 9, 12], 12) === 5);
console.log("all tests pass");
